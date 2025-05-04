import database from "infra/database";
import { NextApiRequest, NextApiResponse } from "next";
import migrationsRunner, { RunnerOption } from "node-pg-migrate";
import { join, resolve } from "node:path";

export default async function (
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const dbClient = await database.getNewClient();

  const migrationConfig: RunnerOption = {
    dbClient: dbClient,
    dir: resolve("infra", "migrations"),
    direction: "up",
    dryRun: true,
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationsRunner(migrationConfig);

    dbClient.end();
    return response.status(200).send(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationsRunner({
      ...migrationConfig,
      dryRun: false,
    });

    dbClient.end();

    let status = 200;
    if (migratedMigrations.length > 0) {
      status = 201;
    }

    return response.status(status).send(migratedMigrations);
  }

  return response.status(405).end();
}
