# Momentum Tasks

A modern full-stack task management application built with React, Vite, and Express.js.

Momentum Tasks provides a clean and responsive productivity experience where users can create, organize, filter, search, update, and manage daily tasks efficiently through a lightweight REST API and responsive frontend interface.

---

## 🚀 Live Demo

### Frontend

https://momentum-tasks-lb8gc3aet-rohit-bansals-projects-e71270a5.vercel.app/

### Backend API

https://momentum-tasks-8ror.onrender.com

### Health Endpoint

https://momentum-tasks-8ror.onrender.com/api/health

---

# ✨ Features

* Create, edit, complete, and delete tasks
* Smart task filtering (All / Active / Completed)
* Real-time task search
* Due date support
* Overdue task highlighting
* Live task statistics dashboard
* Persistent JSON-based storage
* RESTful API architecture
* Fully responsive UI
* Error handling and loading states
* Backend API test coverage

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* JavaScript (ES Modules)
* CSS3

## Backend

* Node.js
* Express.js

## Utilities & Libraries

* NanoID
* Dotenv
* CORS
* Supertest

## Deployment

* Vercel (Frontend)
* Render (Backend)

---

# 📂 Project Structure

```text
Momentum-Tasks/
│
├── client/
│   ├── src/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── routes/
│   │   │   └── tasks.js
│   │   │
│   │   ├── storage/
│   │   │   └── taskStore.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── test/
│   │   └── tasks.test.js
│   │
│   └── package.json
│
├── package.json
└── README.md
```

---

# ⚙️ Local Development Setup

## 1. Clone Repository

```bash
git clone https://github.com/RohitBansal-github/Momentum-Tasks.git
cd Momentum-Tasks
```

---

# 🔧 Backend Setup

## Navigate to server

```bash
cd server
```

## Install dependencies

```bash
npm install
```

## Configure environment variables

Create a `.env` file inside the `server` directory:

```env
PORT=4000
TASKS_FILE=./data/tasks.json
```

## Start backend server

```bash
npm start
```

Backend runs at:

```bash
http://localhost:4000
```

---

# 💻 Frontend Setup

## Navigate to client

```bash
cd client
```

## Install dependencies

```bash
npm install
```

## Configure environment variables

Create a `.env` file inside the `client` directory:

```env
VITE_API_BASE_URL=http://localhost:4000/api
```

## Start frontend

```bash
npm run dev
```

Frontend runs at:

```bash
http://localhost:5173
```

---

# 📡 API Endpoints

## Health Check

```http
GET /api/health
```

---

## Get All Tasks

```http
GET /api/tasks
```

### Query Parameters

| Parameter | Description              |
| --------- | ------------------------ |
| status    | all / active / completed |
| search    | search tasks by title    |

Example:

```http
GET /api/tasks?status=active&search=task
```

---

## Create Task

```http
POST /api/tasks
```

### Request Body

```json
{
  "title": "Finish project documentation",
  "description": "Add deployment instructions and API docs",
  "dueDate": "2026-06-10"
}
```

---

## Update Task

```http
PATCH /api/tasks/:id
```

---

## Delete Task

```http
DELETE /api/tasks/:id
```

---

## Task Summary

```http
GET /api/tasks/summary
```

---

# 🧪 Testing

Run backend API tests:

```bash
cd server
npm test
```

Current test coverage includes:

* Task creation
* Validation
* Filtering
* Completion updates
* Task listing

---

# 🎯 Key Highlights

* Clean separation of frontend and backend architecture
* Modular Express route and storage structure
* Responsive UI with lightweight styling
* Production-ready environment configuration
* RESTful API design
* Persistent task storage without external database dependency
* Optimized for simplicity, maintainability, and readability

---

# 🔮 Future Improvements

Potential future enhancements include:

* Drag-and-drop task ordering
* Authentication & user accounts
* Database integration (MongoDB/PostgreSQL)
* Dark mode support
* Frontend component testing
* Task categories & priorities
* Docker containerization
* CI/CD workflows

---

# 👨‍💻 Author

Rohit Bansal

GitHub:
https://github.com/RohitBansal-github

---

# 📄 License

This project is licensed under the MIT License.
