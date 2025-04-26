import { Client, QueryConfig } from "pg";

const clientConfig = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USER,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  ssl: process.env.NODE_ENV !== "development",
};

const query = async (queryObject: string | QueryConfig) => {
  const client = new Client(clientConfig);
  await client.connect();

  try {
    const query = await client.query(queryObject);
    return query;
  } catch (err) {
    console.log(`\nDATABASE ERROR: ${err}\n`);
  } finally {
    await client.end();
  }
};

export default {
  query,
};
