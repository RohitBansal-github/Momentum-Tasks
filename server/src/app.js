import express from "express";
import cors from "cors";
import { createTaskRouter } from "./routes/tasks.js";
import { createTaskStore } from "./storage/taskStore.js";

export function createApp(options = {}) {
  const app = express();
  const store = options.store ?? createTaskStore();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      message: "Task manager API is running",
    });
  });

  app.use("/api/tasks", createTaskRouter(store));

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  });

  return app;
}
