import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAll();
});

test("GET api/v1/status should return 200 status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const { updated_at, dependencies } = await response.json();
  expect(updated_at).toBeDefined();

  const updatedAt = new Date(updated_at).toISOString();
  expect(updated_at).toEqual(updatedAt);

  const { max_connections, version, opened_connections, ...rest } =
    dependencies.database;

  expect(max_connections).toBe(100);
  expect(version).toBe("17.4");
  expect(opened_connections).toBe(1);
  expect(Object.keys(rest).length).toBe(0);
});
