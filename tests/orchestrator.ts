import retry from "async-retry";
import database from "infra/database";

const waitForAllServices = async () => {
  const waitForWebServer = () => {
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

  await waitForWebServer();
};

const clearDatabase = async () => {
  return await database.query(
    "drop schema if exists public cascade; create schema public;",
  );
};

const waitForAll = async () => {
  await waitForAllServices();
  await clearDatabase();
};

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  waitForAll,
};

export default orchestrator;
