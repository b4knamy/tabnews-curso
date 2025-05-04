import { Client, QueryConfig } from "pg";

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
  } catch (err) {
    console.log(`\nDATABASE ERROR: ${err}\n`);
  } finally {
    await client.end();
  }
};

const getNewClient = async () => {
  const client = new Client(clientConfig);
  await client.connect();
  return client;
};

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production";
}

export default {
  query,
  getNewClient,
};
