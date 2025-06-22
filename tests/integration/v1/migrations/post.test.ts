import orchestrator from "tests/orchestrator.ts";

beforeAll(async () => {
  await orchestrator.waitForAll();
});

describe("POST api/v1/migrations", () => {
  describe("Anonymous User", () => {
    test("should return 201 status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
      });

      expect(response.status).toBe(201);
    });
    test("should return 200 status", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations", {
        method: "POST",
      });

      expect(response.status).toBe(200);
      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBe(0);
    });
  });
});
