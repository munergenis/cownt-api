// import ServerlessHttp from "serverless-http";
import app from "./app";
import { connectDB } from "./db/config";

connectDB();

// export const handler = ServerlessHttp(app);

app.listen(3000, () => {
  console.log(`Server listening on http://localhost:3000`);
});
