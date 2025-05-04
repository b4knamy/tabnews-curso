import database from "infra/database";
import { NextApiRequest, NextApiResponse } from "next";
import migrationsRunner, { RunnerOption } from "node-pg-migrate";
import { resolve } from "node:path";

export default async function (
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (!["GET", "POST"].includes(request.method)) {
    return response.status(405).end();
  }
  const dbClient = await database.getNewClient();

  const migrationConfig: RunnerOption = {
    dbClient: dbClient,
    dir: resolve("infra", "migrations"),
    direction: "up",
    dryRun: request.method === "GET",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  const migrationsRunned = await migrationsRunner(migrationConfig);
  dbClient.end();

  let status = 200;

  if (request.method === "POST" && migrationsRunned.length > 0) {
    status = 201;
  }

  return response.status(status).send(migrationsRunned);
}
