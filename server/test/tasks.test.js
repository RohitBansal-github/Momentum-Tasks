import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import request from "supertest";
import { createApp } from "../src/app.js";
import { createTaskStore } from "../src/storage/taskStore.js";

async function createTestApp() {
  const filePath = path.join(await fs.mkdtemp(path.join(os.tmpdir(), "tasks-")), "tasks.json");
  return createApp({ store: createTaskStore(filePath) });
}

test("creates and lists tasks newest first", async () => {
  const app = await createTestApp();

  const first = await request(app)
    .post("/api/tasks")
    .send({ title: "Book tickets", description: "Train to Gurgaon" })
    .expect(201);

  const second = await request(app)
    .post("/api/tasks")
    .send({ title: "Prepare README" })
    .expect(201);

  const response = await request(app).get("/api/tasks").expect(200);

  assert.equal(response.body.tasks.length, 2);
  assert.equal(response.body.tasks[0].id, second.body.task.id);
  assert.equal(response.body.tasks[1].id, first.body.task.id);
});

test("validates title and supports complete filtering", async () => {
  const app = await createTestApp();

  await request(app).post("/api/tasks").send({ title: "" }).expect(400);

  const created = await request(app)
    .post("/api/tasks")
    .send({ title: "Finish assessment" })
    .expect(201);

  await request(app)
    .patch(`/api/tasks/${created.body.task.id}`)
    .send({ completed: true })
    .expect(200);

  const completed = await request(app).get("/api/tasks?status=completed").expect(200);
  const active = await request(app).get("/api/tasks?status=active").expect(200);

  assert.equal(completed.body.tasks.length, 1);
  assert.equal(active.body.tasks.length, 0);
});
