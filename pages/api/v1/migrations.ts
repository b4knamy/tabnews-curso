import controller from "infra/controller";
import database from "infra/database";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import migrationsRunner, { RunnerOption } from "node-pg-migrate";
import { resolve } from "node:path";
const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller);

const migrationsConfig: Omit<RunnerOption, "dbClient"> = {
  dir: resolve("infra", "migrations"),
  direction: "up",
  dryRun: true,
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationsRunner({
      ...migrationsConfig,
      dbClient,
    });

    return response.status(200).send(pendingMigrations);
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();
    const migratedMigrations = await migrationsRunner({
      ...migrationsConfig,
      dbClient,
      dryRun: false,
    });

    let status = 200;
    if (migratedMigrations.length > 0) {
      status = 201;
    }
    return response.status(status).send(migratedMigrations);
  } finally {
    await dbClient?.end();
  }
}
