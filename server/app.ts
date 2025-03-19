import express from "express";
import cowRouter from "./cow/router";
import sheepRouter from "./sheep/router";

const app = express();

// middlewares
app.use(express.json());

app.use("/api/cows", cowRouter);
app.use("/api/sheeps", sheepRouter);

export default app;
