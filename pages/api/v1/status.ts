import { NextApiRequest, NextApiResponse } from "next";

export default function (request: NextApiRequest, response: NextApiResponse) {
  // console.log(request);
  response.status(200).send({
    message: "its working",
  });
}
