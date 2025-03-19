import ServerlessHttp from "serverless-http";
import app from "../../server/app";
import { connectDB } from "../../server/db/config";

connectDB();

export const handler = ServerlessHttp(app);
