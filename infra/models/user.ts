import database from "infra/database";
import { ValidationError } from "infra/errors";

const create = async (userInputValues: UserInputValues) => {
  await validateUserInputValues(userInputValues);

  const newUser = await runInsertQuery(userInputValues);

  return newUser;

  async function runInsertQuery(userInputValues: UserInputValues) {
    const results = await database.query({
      text: `
        INSERT INTO
          users (username, email, password)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0] as User;
  }

  async function validateUserInputValues(userInputValues: UserInputValues) {
    await validateUniqueEmail(userInputValues.email);
    await validateUniqueUsername(userInputValues.username);
  }

  async function validateUniqueEmail(email: string) {
    const results = await database.query({
      text: `
        SELECT
          email
        FROM
          users
        WHERE
          LOWER(email) = LOWER($1)
        ;`,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "This email is already in use.",
        action: "Use another email to register.",
      });
    }
  }

  async function validateUniqueUsername(username: string) {
    const results = await database.query({
      text: `
        SELECT
          username
        FROM
          users
        WHERE
          LOWER(username) = LOWER($1)
        ;`,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "This username is already in use.",
        action: "Use another username to register.",
      });
    }
  }
};

const user = {
  create,
};

export default user;

type User = {
  id: string;
  username: string;
  password: string;
  email: string;
  created_at: string;
  updated_at: string;
};

type UserInputValues = Pick<User, "email" | "password" | "username">;
