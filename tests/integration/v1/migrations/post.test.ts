import database from "infra/database.ts";
import orchestrator from "tests/orchestrator.ts";

beforeAll(async () => {
  await orchestrator.waitForAll();
});

test("POST api/v1/migrations should return 200 and 201 status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(response.status).toBe(201);
  const responseBody = await response.json();
  const migrationsName = responseBody.map((row) => row.name);

  const posts = await database.query(
    `SELECT * FROM public.pgmigrations WHERE name IN ('${migrationsName.join("', '")}')`,
  );

  expect(Array.isArray(responseBody)).toBe(true);
  expect(posts.rows.length).toBe(responseBody.length);

  //                --------------------              //

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });

  expect(response2.status).toBe(200);
  const responseBody2 = await response2.json();
  expect(Array.isArray(responseBody2)).toBe(true);
  expect(responseBody2.length).toBe(0);
});
