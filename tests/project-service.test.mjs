import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { beforeEach, test } from "node:test";

// Node 22.18+ executa TypeScript nativo; resolve os imports sem extensão do Vite.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

const { projectService } = await import("../src/modules/projetos/services/project.service.ts");
const { localStorageProjectRepository: projectRepository } = await import("../src/modules/projetos/repositories/localStorageProjectRepository.ts");
const key = "jarvis:projects";
let storage;
let writes;

beforeEach(() => {
  storage = new Map();
  writes = 0;
  globalThis.localStorage = {
    getItem: (key) => storage.get(key) ?? null,
    setItem: (key, value) => { writes++; storage.set(key, value); },
  };
});

test("cria e recupera projetos, normalizando textos e preservando o formato salvo", () => {
  assert.deepEqual(projectService.getAll(), []);
  assert.equal(projectService.getById("missing"), null);
  const project = projectService.create({ name: "  JARVIS  ", description: "  Estudos  " });
  assert.equal(project.name, "JARVIS");
  assert.equal(project.description, "Estudos");
  assert.ok(project.id);
  assert.equal(project.createdAt, project.updatedAt);
  assert.equal(project.archivedAt, null);
  assert.deepEqual(projectService.getById(project.id), project);
  assert.deepEqual(JSON.parse(storage.get(key)), [project]);
});

test("edição parcial preserva campos não enviados e outros projetos", () => {
  const first = projectService.create({ name: "Primeiro", description: "Descrição" });
  const second = projectService.create({ name: "Segundo", description: "Outro" });
  const updated = projectService.update(first.id, { name: "  Editado  " });
  assert.equal(updated.name, "Editado");
  assert.equal(updated.description, first.description);
  assert.equal(updated.createdAt, first.createdAt);
  assert.equal(updated.id, first.id);
  assert.deepEqual(projectService.getAll(), [updated, second]);
  assert.equal(projectService.update(first.id, { description: "" }).description, "");
});

test("arquivar e restaurar definem datas e são idempotentes", () => {
  const project = projectService.create({ name: "Projeto", description: "" });
  const archived = projectService.archive(project.id);
  assert.ok(archived.archivedAt);
  assert.equal(archived.archivedAt, archived.updatedAt);
  assert.equal(archived.createdAt, project.createdAt);
  const afterArchive = writes;
  assert.deepEqual(projectService.archive(project.id), archived);
  assert.equal(writes, afterArchive);
  const restored = projectService.restore(project.id);
  assert.equal(restored.archivedAt, null);
  assert.equal(restored.createdAt, project.createdAt);
  const afterRestore = writes;
  assert.deepEqual(projectService.restore(project.id), restored);
  assert.equal(writes, afterRestore);
  assert.deepEqual(projectService.getById(project.id), restored);
});

test("operações em projeto inexistente falham sem gravar", () => {
  for (const operation of [
    () => projectService.update("missing", { name: "Novo" }),
    () => projectService.archive("missing"),
    () => projectService.restore("missing"),
  ]) assert.throws(operation, /Projeto não encontrado/);
  assert.equal(writes, 0);
});

test("repository salva o objeto recebido sem modificar textos, IDs ou datas", () => {
  const project = {
    id: "legacy", name: "  Sem normalizar  ", description: "",
    createdAt: "2020-01-01", updatedAt: "2020-01-02", archivedAt: null,
  };
  projectRepository.save(project);
  assert.deepEqual(projectRepository.getById(project.id), project);
  projectRepository.save({ ...project, description: "Atualizado" });
  assert.equal(projectRepository.getAll().length, 1);
  assert.equal(projectRepository.getById(project.id).updatedAt, project.updatedAt);
});

test("dados antigos continuam legíveis e erros de armazenamento são propagados", () => {
  const legacy = { id: "old", name: "Antigo", description: "", createdAt: "2020", updatedAt: "2020", archivedAt: null };
  storage.set(key, JSON.stringify([legacy]));
  assert.deepEqual(projectService.getById("old"), legacy);
  storage.set(key, "{}");
  assert.throws(() => projectService.getAll(), /Dados de projetos/);
  storage.set(key, "invalid json");
  assert.throws(() => projectService.getAll(), SyntaxError);
  storage.delete(key);
  localStorage.setItem = () => { throw new Error("Quota excedida"); };
  assert.throws(() => projectService.create({ name: "Novo", description: "" }), /Quota excedida/);
});
