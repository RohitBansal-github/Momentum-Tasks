import express from "express";
import { nanoid } from "nanoid";

function normalizeTaskInput(body, existingTask = {}) {
  const title =
    typeof body.title === "string" ? body.title.trim() : existingTask.title;
  const description =
    typeof body.description === "string"
      ? body.description.trim()
      : (existingTask.description ?? "");
  const dueDate = Object.hasOwn(body, "dueDate")
    ? body.dueDate === "" || body.dueDate == null
      ? null
      : body.dueDate
    : (existingTask.dueDate ?? null);

  return {
    title: title ?? existingTask.title,
    description,
    dueDate,
  };
}

function validateTaskInput(input, { partial = false } = {}) {
  const errors = {};

  if (!partial || Object.hasOwn(input, "title")) {
    if (!input.title || input.title.trim().length === 0) {
      errors.title = "Title is required.";
    }
  }

  if (input.dueDate) {
    const parsedDate = new Date(`${input.dueDate}T00:00:00`);
    if (Number.isNaN(parsedDate.getTime())) {
      errors.dueDate = "Due date must be a valid date.";
    }
  }

  return errors;
}

function sortNewestFirst(tasks) {
  return [...tasks].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export function createTaskRouter(store) {
  const router = express.Router();

  router.get("/", async (req, res, next) => {
    try {
      const status = req.query.status ?? "all";
      const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";
      let tasks = await store.getAll();

      if (status === "active") {
        tasks = tasks.filter((task) => !task.completed);
      } else if (status === "completed") {
        tasks = tasks.filter((task) => task.completed);
      } else if (status !== "all") {
        return res.status(400).json({ error: "Status must be all, active, or completed." });
      }

      if (search) {
        tasks = tasks.filter((task) => task.title.toLowerCase().includes(search));
      }

      res.json({ tasks: sortNewestFirst(tasks) });
    } catch (error) {
      next(error);
    }
  });

  router.get("/summary", async (_req, res, next) => {
    try {
      const tasks = await store.getAll();
      res.json({
        total: tasks.length,
        active: tasks.filter((task) => !task.completed).length,
        completed: tasks.filter((task) => task.completed).length,
      });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const input = normalizeTaskInput(req.body);
      const errors = validateTaskInput(input);

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const now = new Date().toISOString();
      const task = {
        id: nanoid(),
        title: input.title,
        description: input.description,
        dueDate: input.dueDate,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      await store.create(task);
      res.status(201).json({ task });
    } catch (error) {
      next(error);
    }
  });

  router.patch("/:id", async (req, res, next) => {
    try {
      const existingTask = await store.getById(req.params.id);

      if (!existingTask) {
        return res.status(404).json({ error: "Task not found." });
      }

      const editableFields = {};
      for (const field of ["title", "description", "dueDate", "completed"]) {
        if (Object.hasOwn(req.body, field)) {
          editableFields[field] = req.body[field];
        }
      }

      const input = normalizeTaskInput(editableFields, existingTask);
      const errors = validateTaskInput(input, { partial: true });

      if (Object.keys(errors).length > 0) {
        return res.status(400).json({ errors });
      }

      const updates = {
        ...input,
        completed:
          typeof editableFields.completed === "boolean"
            ? editableFields.completed
            : existingTask.completed,
        updatedAt: new Date().toISOString(),
      };

      const task = await store.update(req.params.id, updates);
      res.json({ task });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      const deleted = await store.remove(req.params.id);

      if (!deleted) {
        return res.status(404).json({ error: "Task not found." });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
