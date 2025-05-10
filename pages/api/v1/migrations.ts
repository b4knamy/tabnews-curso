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
    return response.status(405).json({
      error: `Method "${request.method} not allowed."`,
    });
  }
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const migrationsConfig: RunnerOption = {
      dbClient: dbClient,
      dir: resolve("infra", "migrations"),
      direction: "up",
      dryRun: true,
      verbose: true,
      migrationsTable: "pgmigrations",
    };

    let status = 200;
    if (request.method === "POST") {
      const migratedMigrations = await migrationsRunner({
        ...migrationsConfig,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        status = 201;
      }
      return response.status(status).send(migratedMigrations);
    }

    const pendingMigrations = await migrationsRunner(migrationsConfig);
    return response.status(status).send(pendingMigrations);
  } catch (error) {
    console.error(error);
  } finally {
    await dbClient.end();
  }
}
