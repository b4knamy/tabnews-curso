import controller from "infra/controller";
import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import user from "infra/models/user.ts";

async function postHandler(request: NextApiRequest, response: NextApiResponse) {
  const userInputValues = request.body;
  const newUser = await user.create(userInputValues);

  return response.status(201).send(newUser);
}

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(postHandler);

export default router.handler(controller);
