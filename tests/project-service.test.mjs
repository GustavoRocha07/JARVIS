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

test("cria e recupera projetos, normalizando textos e preservando o formato salvo", async () => {
  assert.deepEqual((await projectService.getAll()), []);
  assert.equal((await projectService.getById("missing")), null);
  const project = (await projectService.create({ name: "  JARVIS  ", description: "  Estudos  " }));
  assert.equal(project.name, "JARVIS");
  assert.equal(project.description, "Estudos");
  assert.ok(project.id);
  assert.equal(project.createdAt, project.updatedAt);
  assert.equal(project.archivedAt, null);
  assert.deepEqual((await projectService.getById(project.id)), project);
  assert.deepEqual(JSON.parse(storage.get(key)), [project]);
});

test("edição parcial preserva campos não enviados e outros projetos", async () => {
  const first = (await projectService.create({ name: "Primeiro", description: "Descrição" }));
  const second = (await projectService.create({ name: "Segundo", description: "Outro" }));
  const updated = (await projectService.update(first.id, { name: "  Editado  " }));
  assert.equal(updated.name, "Editado");
  assert.equal(updated.description, first.description);
  assert.equal(updated.createdAt, first.createdAt);
  assert.equal(updated.id, first.id);
  assert.deepEqual((await projectService.getAll()), [updated, second]);
  assert.equal((await projectService.update(first.id, { description: "" })).description, "");
});

test("arquivar e restaurar definem datas e são idempotentes", async () => {
  const project = (await projectService.create({ name: "Projeto", description: "" }));
  const archived = (await projectService.archive(project.id));
  assert.ok(archived.archivedAt);
  assert.equal(archived.archivedAt, archived.updatedAt);
  assert.equal(archived.createdAt, project.createdAt);
  const afterArchive = writes;
  assert.deepEqual((await projectService.archive(project.id)), archived);
  assert.equal(writes, afterArchive);
  const restored = (await projectService.restore(project.id));
  assert.equal(restored.archivedAt, null);
  assert.equal(restored.createdAt, project.createdAt);
  const afterRestore = writes;
  assert.deepEqual((await projectService.restore(project.id)), restored);
  assert.equal(writes, afterRestore);
  assert.deepEqual((await projectService.getById(project.id)), restored);
});

test("operações em projeto inexistente falham sem gravar", async () => {
  for (const operation of [
    async () => (await projectService.update("missing", { name: "Novo" })),
    async () => (await projectService.archive("missing")),
    async () => (await projectService.restore("missing")),
  ]) await assert.rejects(operation, /Projeto não encontrado/);
  assert.equal(writes, 0);
});

test("repository salva o objeto recebido sem modificar textos, IDs ou datas", async () => {
  const project = {
    id: "legacy", name: "  Sem normalizar  ", description: "",
    createdAt: "2020-01-01", updatedAt: "2020-01-02", archivedAt: null,
  };
  (await projectRepository.save(project));
  assert.deepEqual((await projectRepository.getById(project.id)), project);
  (await projectRepository.save({ ...project, description: "Atualizado" }));
  assert.equal((await projectRepository.getAll()).length, 1);
  assert.equal((await projectRepository.getById(project.id)).updatedAt, project.updatedAt);
});

test("dados antigos continuam legíveis e erros de armazenamento são propagados", async () => {
  const legacy = { id: "old", name: "Antigo", description: "", createdAt: "2020", updatedAt: "2020", archivedAt: null };
  storage.set(key, JSON.stringify([legacy]));
  assert.deepEqual((await projectService.getById("old")), legacy);
  storage.set(key, "{}");
  await assert.rejects(async () => (await projectService.getAll()), /Dados de projetos/);
  storage.set(key, "invalid json");
  await assert.rejects(async () => (await projectService.getAll()), SyntaxError);
  storage.delete(key);
  localStorage.setItem = () => { throw new Error("Quota excedida"); };
  await assert.rejects(async () => (await projectService.create({ name: "Novo", description: "" })), /Quota excedida/);
});
