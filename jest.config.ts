/* eslint-disable @typescript-eslint/no-require-imports */

const nextJest = require("next/jest");
const dotenv = require("dotenv");

dotenv.config({
  path: "./.env.development",
});

const createJestConfig = nextJest({
  dir: ".",
});

const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
  testTimeout: 60000,
});

export default jestConfig;
