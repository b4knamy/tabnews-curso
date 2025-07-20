import controller from "infra/controller";
import migrator from "infra/models/migrator";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";

async function getHandler(request: NextApiRequest, response: NextApiResponse) {
  const pendingMigrations = await migrator.listPendingMigrations();

  return response.status(200).send(pendingMigrations);
}

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const migratedMigrations = await migrator.runPendingMigrations();

  let status = 200;
  if (migratedMigrations.length > 0) {
    status = 201;
  }

  return response.status(status).send(migratedMigrations);
}

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller);
