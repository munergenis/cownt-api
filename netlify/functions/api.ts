import ServerlessHttp from "serverless-http";
import app from "../../server/app";
import { connectDB } from "../../server/db/config";
import { HandlerContext, HandlerEvent } from "@netlify/functions";

const dbConnection = connectDB();

export const handler = async (event: HandlerEvent, context: HandlerContext) => {
  await dbConnection;

  const serverlessHandler = ServerlessHttp(app);

  return serverlessHandler(event, context);
};
