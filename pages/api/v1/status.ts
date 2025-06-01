import { NextApiRequest, NextApiResponse } from "next";
import database from "infra/database.ts";

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const updatedAt = new Date().toISOString();
  const maxConnectionResult = await database.query("SHOW max_connections;");
  const versionResult = await database.query("SHOW server_version;");
  const openedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DB],
  });

  response.status(200).send({
    updated_at: updatedAt,
    dependencies: {
      database: {
        max_connections: parseInt(maxConnectionResult.rows[0].max_connections),
        version: versionResult.rows[0].server_version,
        opened_connections: openedConnections.rows[0].count,
      },
    },
  });
}
