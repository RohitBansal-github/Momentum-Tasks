import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const defaultDataPath = path.join(__dirname, "../../data/tasks.json");

export function createTaskStore(filePath = process.env.TASKS_FILE || defaultDataPath) {
  async function ensureFile() {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, "[]", "utf8");
    }
  }

  async function readTasks() {
    await ensureFile();
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content);
  }

  async function writeTasks(tasks) {
    await ensureFile();
    await fs.writeFile(filePath, JSON.stringify(tasks, null, 2), "utf8");
  }

  return {
    async getAll() {
      return readTasks();
    },

    async getById(id) {
      const tasks = await readTasks();
      return tasks.find((task) => task.id === id) ?? null;
    },

    async create(task) {
      const tasks = await readTasks();
      tasks.push(task);
      await writeTasks(tasks);
      return task;
    },

    async update(id, updates) {
      const tasks = await readTasks();
      const index = tasks.findIndex((task) => task.id === id);

      if (index === -1) {
        return null;
      }

      tasks[index] = { ...tasks[index], ...updates };
      await writeTasks(tasks);
      return tasks[index];
    },

    async remove(id) {
      const tasks = await readTasks();
      const nextTasks = tasks.filter((task) => task.id !== id);

      if (nextTasks.length === tasks.length) {
        return false;
      }

      await writeTasks(nextTasks);
      return true;
    },
  };
}
