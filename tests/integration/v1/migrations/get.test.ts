import database from "infra/database";

beforeAll(async () => {
  await database.query(
    "drop schema if exists public cascade; create schema public;",
  );
});

test("GET api/v1/status should return 200 status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
