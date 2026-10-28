import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { test } from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
      return nextResolve(`${specifier}.ts`, context);
    }
    return nextResolve(specifier, context);
  },
});

const { createProjectService } = await import("../src/modules/projetos/services/createProjectService.ts");
const { createMemoryProjectRepository } = await import("../src/modules/projetos/repositories/memoryProjectRepository.ts");

const seed = {
  id: "project-1", name: "Projeto", description: "Estudo",
  createdAt: "2020-01-01T00:00:00.000Z", updatedAt: "2020-01-01T00:00:00.000Z", archivedAt: null,
};

// Nenhum mock de localStorage: a fábrica e o adapter em memória não usam o navegador.
test("deve normalizar e persistir quando criar um projeto em memória", () => {
  const repository = createMemoryProjectRepository();
  const service = createProjectService(repository);
  const project = service.create({ name: "  JARVIS  ", description: "  Estudo  " });
  assert.equal(project.name, "JARVIS");
  assert.equal(project.description, "Estudo");
  assert.equal(project.archivedAt, null);
  assert.equal(project.createdAt, project.updatedAt);
  assert.deepEqual(repository.getById(project.id), project);
});

test("deve preservar os demais campos quando editar parcialmente", () => {
  const service = createProjectService(createMemoryProjectRepository([seed]));
  const updated = service.update(seed.id, { name: "  Novo  " });
  assert.equal(updated.name, "Novo");
  assert.equal(updated.description, seed.description);
  assert.equal(updated.createdAt, seed.createdAt);
  assert.notEqual(updated.updatedAt, seed.updatedAt);
  assert.deepEqual(service.getAll(), [updated]);
});

for (const operation of ["archive", "restore"]) {
  test(`deve evitar nova gravação quando repetir ${operation}`, () => {
    const initial = operation === "archive" ? seed : { ...seed, archivedAt: seed.createdAt };
    const repository = createMemoryProjectRepository([initial]);
    let writes = 0;
    const service = createProjectService({
      ...repository,
      save(project) { writes++; repository.save(project); },
    });
    const result = service[operation](seed.id);
    assert.equal(result.archivedAt, operation === "archive" ? result.updatedAt : null);
    assert.notEqual(result.updatedAt, seed.updatedAt);
    assert.deepEqual(service[operation](seed.id), result);
    assert.equal(writes, 1);
    assert.deepEqual(service.getById(seed.id), result);
  });
}

for (const operation of ["update", "archive", "restore"]) {
  test(`deve lançar erro quando ${operation} receber um ID inexistente`, () => {
    const service = createProjectService(createMemoryProjectRepository([seed]));
    assert.throws(() => service[operation]("missing", {}), /Projeto não encontrado/);
    assert.deepEqual(service.getAll(), [seed]);
  });
}

test("deve isolar dados quando criar repositories distintos", () => {
  const first = createProjectService(createMemoryProjectRepository());
  const second = createProjectService(createMemoryProjectRepository());
  first.create({ name: "Primeiro", description: "" });
  assert.deepEqual(second.getAll(), []);
  assert.equal(second.getById("missing"), null);
});

test("deve proteger a persistência quando objetos externos forem alterados", () => {
  const input = { ...seed };
  const repository = createMemoryProjectRepository([input]);
  input.name = "Mutação na entrada";
  repository.getById(seed.id).name = "Mutação na leitura";
  repository.getAll()[0].name = "Mutação na lista";
  assert.deepEqual(repository.getById(seed.id), seed);
  const saved = { ...seed, name: "Salvo" };
  repository.save(saved);
  saved.name = "Mutação após salvar";
  assert.equal(repository.getById(seed.id).name, "Salvo");
  assert.equal(repository.getAll().length, 1);
});
