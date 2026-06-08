# Personal Task Manager

This project is my submission for **Exercise 1: Personal Task Manager** from the Studio Graphene Full Stack Developer assessment. It is a small full-stack task manager where one user can create, view, update, complete, filter, search, and delete personal tasks.

## Live Demo Links

- Frontend: To be added after deployment
- Backend API: To be added after deployment

## Tech Stack

- **Frontend:** React with Vite, using functional components and hooks for UI state.
- **Backend:** Node.js and Express for a simple REST API.
- **Storage:** JSON file persistence so tasks survive server restarts.
- **Styling:** Plain CSS to keep the UI lightweight and easy to review.
- **Testing:** Node's built-in test runner with Supertest for backend API coverage.

I used AI assistance while building this project, but I reviewed the code and kept the implementation intentionally straightforward so I can explain each file in the follow-up interview.

## How to Run Locally

Assuming Node.js is installed:

```bash
npm install
npm run install:all
npm run dev
```

Then open:

- React app: `http://localhost:5173`
- Express API: `http://localhost:4000/api`

To run the backend tests:

```bash
npm test
```

To build the frontend:

```bash
npm run build
```

## API Documentation

### Health Check

`GET /api/health`

Response:

```json
{
  "status": "ok"
}
```

### List Tasks

`GET /api/tasks?status=all&search=readme`

Query parameters:

- `status`: `all`, `active`, or `completed`
- `search`: optional title search

Response:

```json
{
  "tasks": [
    {
      "id": "abc123",
      "title": "Finish README",
      "description": "Add API docs and deployment links",
      "dueDate": "2026-06-05",
      "completed": false,
      "createdAt": "2026-06-03T18:00:00.000Z",
      "updatedAt": "2026-06-03T18:00:00.000Z"
    }
  ]
}
```

Tasks are returned newest first by `createdAt`.

### Task Summary

`GET /api/tasks/summary`

Response:

```json
{
  "total": 3,
  "active": 2,
  "completed": 1
}
```

### Create Task

`POST /api/tasks`

Request body:

```json
{
  "title": "Finish assessment",
  "description": "Check requirements and deploy",
  "dueDate": "2026-06-05"
}
```

Response:

```json
{
  "task": {
    "id": "abc123",
    "title": "Finish assessment",
    "description": "Check requirements and deploy",
    "dueDate": "2026-06-05",
    "completed": false,
    "createdAt": "2026-06-03T18:00:00.000Z",
    "updatedAt": "2026-06-03T18:00:00.000Z"
  }
}
```

### Update Task

`PATCH /api/tasks/:id`

Request body can include any of:

```json
{
  "title": "Finish and deploy assessment",
  "description": "Update README with live links",
  "dueDate": "2026-06-06",
  "completed": true
}
```

Response:

```json
{
  "task": {
    "id": "abc123",
    "title": "Finish and deploy assessment",
    "description": "Update README with live links",
    "dueDate": "2026-06-06",
    "completed": true,
    "createdAt": "2026-06-03T18:00:00.000Z",
    "updatedAt": "2026-06-03T19:00:00.000Z"
  }
}
```

### Delete Task

`DELETE /api/tasks/:id`

Response: `204 No Content`

## Project Structure

```text
.
├── client
│   ├── src
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server
│   ├── src
│   │   ├── routes
│   │   │   └── tasks.js
│   │   ├── storage
│   │   │   └── taskStore.js
│   │   ├── app.js
│   │   └── server.js
│   ├── test
│   │   └── tasks.test.js
│   └── package.json
├── package.json
└── README.md
```

## What Works

- Add tasks with required title, optional description, and optional due date.
- View tasks newest first.
- Toggle tasks complete or incomplete.
- Edit title, description, and due date.
- Delete tasks with a browser confirmation prompt.
- Filter by all, active, and completed.
- Search by task title.
- Show active and completed counts.
- Highlight overdue incomplete tasks.
- Show loading, error, and empty states.
- Persist tasks in `server/data/tasks.json` across server restarts.
- Backend API tests cover creation, listing, validation, completion, and filtering.

## Next Steps

If I had more time, I would add drag-and-drop reordering, improve keyboard shortcuts for faster task entry, add frontend component tests, and deploy the frontend and backend with environment-specific API URLs.
