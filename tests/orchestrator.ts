import retry from "async-retry";
import database from "infra/database";
const waitForWebServer = async () => {
  const tryFetchStatusPage = async () => {
    const response = await fetch("http://localhost:3000/api/v1/status");

    if (response.status !== 200) {
      throw Error();
    }
  };

  return retry(tryFetchStatusPage, {
    retries: 100,
    maxTimeout: 1000,
  });
};

const clearDatabase = async () => {
  return await database.query(
    "drop schema if exists public cascade; create schema public;",
  );
};

const waitForAllServices = async () => {
  await waitForWebServer();
  await clearDatabase();
};

export default {
  waitForAllServices,
};
