import database from "infra/database";
import { ServiceError } from "infra/errors";
import migrationsRunner from "node-pg-migrate";
import { resolve } from "node:path";

const runMigrations = async (options?: runMigrationsOptions) => {
  let dbClient = await database.getNewClient();

  try {
    return await migrationsRunner({
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
      dryRun: options?.dryRun ?? true,
      dbClient,
    });
  } catch (error) {
    throw new ServiceError({
      message: "Failed when running migrations",
      cause: error,
    });
  } finally {
    dbClient?.end();
  }
};

const listPendingMigrations = async () => {
  return await runMigrations();
};

const runPendingMigrations = async () => {
  return await runMigrations({
    dryRun: false,
  });
};

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;

type runMigrationsOptions = {
  dryRun: boolean;
};
