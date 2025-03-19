import express from "express";
import cowRouter from "./cows/router";

const app = express();

// middlewares
app.use(express.json());

app.use("/api/cows", cowRouter);

export default app;
