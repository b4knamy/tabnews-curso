/* eslint-disable @typescript-eslint/no-require-imports */
const { exec } = require("node:child_process");

function checkPostgres() {
  const handleReturn = (error, stdout) => {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log(
      "\n\n====== - Postgres is ready to accept connections. - =======\n",
    );
  };

  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);
}

process.stdout.write(
  "\n====== - Waiting Postgres to accept connections - =======\n",
);
checkPostgres();
