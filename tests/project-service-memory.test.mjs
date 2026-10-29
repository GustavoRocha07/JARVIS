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
test("deve normalizar e persistir quando criar um projeto em memória", async () => {
  const repository = createMemoryProjectRepository();
  const service = createProjectService(repository);
  const project = (await service.create({ name: "  JARVIS  ", description: "  Estudo  " }));
  assert.equal(project.name, "JARVIS");
  assert.equal(project.description, "Estudo");
  assert.equal(project.archivedAt, null);
  assert.equal(project.createdAt, project.updatedAt);
  assert.deepEqual((await repository.getById(project.id)), project);
});

test("deve preservar os demais campos quando editar parcialmente", async () => {
  const service = createProjectService(createMemoryProjectRepository([seed]));
  const updated = (await service.update(seed.id, { name: "  Novo  " }));
  assert.equal(updated.name, "Novo");
  assert.equal(updated.description, seed.description);
  assert.equal(updated.createdAt, seed.createdAt);
  assert.notEqual(updated.updatedAt, seed.updatedAt);
  assert.deepEqual((await service.getAll()), [updated]);
});

for (const operation of ["archive", "restore"]) {
  test(`deve evitar nova gravação quando repetir ${operation}`, async () => {
    const initial = operation === "archive" ? seed : { ...seed, archivedAt: seed.createdAt };
    const repository = createMemoryProjectRepository([initial]);
    let writes = 0;
    const service = createProjectService({
      ...repository,
      async save(project) { writes++; (await repository.save(project)); },
    });
    const result = (await service[operation](seed.id));
    assert.equal(result.archivedAt, operation === "archive" ? result.updatedAt : null);
    assert.notEqual(result.updatedAt, seed.updatedAt);
    assert.deepEqual((await service[operation](seed.id)), result);
    assert.equal(writes, 1);
    assert.deepEqual((await service.getById(seed.id)), result);
  });
}

for (const operation of ["update", "archive", "restore"]) {
  test(`deve lançar erro quando ${operation} receber um ID inexistente`, async () => {
    const service = createProjectService(createMemoryProjectRepository([seed]));
    await assert.rejects(() => service[operation]("missing", {}), /Projeto não encontrado/);
    assert.deepEqual((await service.getAll()), [seed]);
  });
}

test("deve isolar dados quando criar repositories distintos", async () => {
  const first = createProjectService(createMemoryProjectRepository());
  const second = createProjectService(createMemoryProjectRepository());
  (await first.create({ name: "Primeiro", description: "" }));
  assert.deepEqual((await second.getAll()), []);
  assert.equal((await second.getById("missing")), null);
});

test("deve proteger a persistência quando objetos externos forem alterados", async () => {
  const input = { ...seed };
  const repository = createMemoryProjectRepository([input]);
  input.name = "Mutação na entrada";
  (await repository.getById(seed.id)).name = "Mutação na leitura";
  (await repository.getAll())[0].name = "Mutação na lista";
  assert.deepEqual((await repository.getById(seed.id)), seed);
  const saved = { ...seed, name: "Salvo" };
  (await repository.save(saved));
  saved.name = "Mutação após salvar";
  assert.equal((await repository.getById(seed.id)).name, "Salvo");
  assert.equal((await repository.getAll()).length, 1);
});


for (const operation of ["create", "update", "archive", "restore"]) {
  const invoke = (service) => operation === "create"
    ? service.create({ name: "Novo", description: "" })
    : operation === "update" ? service.update(seed.id, { name: "Novo" }) : service[operation](seed.id);

  test(`deve aguardar a persistência quando executar ${operation}`, async () => {
    const initial = operation === "restore" ? { ...seed, archivedAt: seed.createdAt } : seed;
    const repository = createMemoryProjectRepository([initial]);
    let release;
    let started;
    const writing = new Promise((resolve) => { started = resolve; });
    const gate = new Promise((resolve) => { release = resolve; });
    const service = createProjectService({
      ...repository,
      async save(project) { started(); await gate; await repository.save(project); },
    });
    let finished = false;
    const pending = invoke(service).then((project) => { finished = true; return project; });
    await writing;
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(finished, false);
    release();
    const result = await pending;
    assert.deepEqual(await repository.getById(result.id), result);
  });

  test(`deve propagar falha de gravação quando executar ${operation}`, async () => {
    const initial = operation === "restore" ? { ...seed, archivedAt: seed.createdAt } : seed;
    const repository = createMemoryProjectRepository([initial]);
    const service = createProjectService({
      ...repository,
      async save() { throw new Error("Falha na persistência"); },
    });
    await assert.rejects(() => invoke(service), /Falha na persistência/);
    assert.deepEqual(await repository.getAll(), [initial]);
  });
}

for (const name of ["", "   "]) {
  test(`deve rejeitar nome ${JSON.stringify(name)} quando criar ou editar`, async () => {
    const repository = createMemoryProjectRepository([seed]);
    const service = createProjectService(repository);
    await assert.rejects(() => service.create({ name, description: "" }), /obrigatório/i);
    await assert.rejects(() => service.update(seed.id, { name }), /obrigatório/i);
    assert.deepEqual(await repository.getAll(), [seed]);
  });
}
