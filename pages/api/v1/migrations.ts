import database from "infra/database";
import { NextApiRequest, NextApiResponse } from "next";
import migrationsRunner, { RunnerOption } from "node-pg-migrate";
import { resolve } from "node:path";

export default async function (
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const allowedMethods = ["GET", "POST"];

  if (!allowedMethods.includes(request.method)) {
    return response.status(405).end();
  }

  const dbClient = await database.getNewClient();

  const migrationConfig: RunnerOption = {
    dbClient: dbClient,
    dir: resolve("infra", "migrations"),
    direction: "up",
    dryRun: true,
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "POST") {
    const migratedMigrations = await migrationsRunner({
      ...migrationConfig,
      dryRun: false,
    });
    await dbClient.end();

    let status = 200;
    if (migratedMigrations.length > 0) {
      status = 201;
    }

    return response.status(status).send(migratedMigrations);
  }

  const pendingMigrations = await migrationsRunner(migrationConfig);
  await dbClient.end();

  return response.status(200).send(pendingMigrations);
}
