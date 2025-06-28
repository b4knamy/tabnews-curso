import { Client, QueryConfig } from "pg";
import { ServiceError } from "./errors";

const clientConfig = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  ssl: getSSLValues(),
};

const query = async (queryObject: string | QueryConfig) => {
  let client;

  try {
    client = await getNewClient();
    const query = await client.query(queryObject);
    return query;
  } catch (error) {
    throw new ServiceError({
      message: "Failed to execute a query in the database",
      cause: error,
    });
  } finally {
    await client?.end();
  }
};

const getNewClient = async () => {
  try {
    const client = new Client(clientConfig);
    await client.connect();
    return client;
  } catch (error) {
    throw new ServiceError({
      message: "Failed to connect with database",
      cause: error,
    });
  }
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production";
}
const database = {
  query,
  getNewClient,
};
export default database;
