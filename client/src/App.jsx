import { useEffect, useMemo, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchSummary,
  fetchTasks,
  updateTask,
} from "./api.js";

const emptyForm = {
  title: "",
  description: "",
  dueDate: "",
};

const filters = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

function isOverdue(task) {
  if (!task.dueDate || task.completed) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(`${task.dueDate}T00:00:00`) < today;
}

function formatDate(date) {
  if (!date) {
    return "No due date";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, active: 0, completed: 0 });
  const [form, setForm] = useState(emptyForm);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const visibleTaskCount = tasks.length;

  const hasFiltersApplied = useMemo(
    () => filter !== "all" || search.trim().length > 0,
    [filter, search]
  );

  async function loadData() {
    setIsLoading(true);
    setError("");

    try {
      const [tasksResponse, summaryResponse] = await Promise.all([
        fetchTasks({ status: filter, search: search.trim() }),
        fetchSummary(),
      ]);

      setTasks(tasksResponse.tasks);
      setSummary(summaryResponse);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(loadData, 200);
    return () => window.clearTimeout(timeoutId);
  }, [filter, search]);

  function updateForm(field, value) {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingTask(null);
    setFormError("");
  }

  function startEditing(task) {
    setEditingTask(task);
    setForm({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate || "",
    });
    setFormError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.title.trim()) {
      setFormError("Please enter a task title.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        dueDate: form.dueDate || null,
      };

      if (editingTask) {
        await updateTask(editingTask.id, payload);
      } else {
        await createTask(payload);
      }

      resetForm();
      await loadData();
    } catch (saveError) {
      setFormError(saveError.details?.title || saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(task) {
    try {
      await updateTask(task.id, { completed: !task.completed });
      await loadData();
    } catch (toggleError) {
      setError(toggleError.message);
    }
  }

  async function handleDelete(task) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteTask(task.id);
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Momentum Task</p>
          <h1>Personal Task Manager</h1>
          <p className="intro">
            Create, edit, complete, search, and filter personal tasks.
          </p>
        </div>
        <div className="summary" aria-label="Task summary">
          <div>
            <span>{summary.active}</span>
            <p>Active</p>
          </div>
          <div>
            <span>{summary.completed}</span>
            <p>Completed</p>
          </div>
        </div>
      </section>

      <section className="task-layout">
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2>{editingTask ? "Edit task" : "Add task"}</h2>
            {editingTask ? (
              <button className="ghost-button" type="button" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>

          <label>
            Title
            <input
              value={form.title}
              onChange={(event) => updateForm("title", event.target.value)}
              placeholder="What needs to be done?"
              maxLength={120}
            />
          </label>

          <label>
            Description
            <textarea
              value={form.description}
              onChange={(event) => updateForm("description", event.target.value)}
              placeholder="Add useful notes or context"
              rows="4"
            />
          </label>

          <label>
            Due date
            <input
              type="date"
              value={form.dueDate}
              onChange={(event) => updateForm("dueDate", event.target.value)}
            />
          </label>

          {formError ? <p className="form-error">{formError}</p> : null}

          <button className="primary-button" type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : editingTask ? "Save changes" : "Add task"}
          </button>
        </form>

        <section className="task-panel">
          <div className="toolbar">
            <div className="filter-group" role="group" aria-label="Filter tasks">
              {filters.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={filter === item.value ? "active" : ""}
                  onClick={() => setFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <input
              className="search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value.trimStart())}
              placeholder="Search tasks by title"
            />
          </div>

          <div className="list-meta">
            <span>
              Showing {visibleTaskCount} task{visibleTaskCount === 1 ? "" : "s"}
            </span>
            <span>Total {summary.total}</span>
          </div>

          {error ? <p className="error-banner">{error}</p> : null}

          {isLoading ? (
            <div className="empty-state">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              {hasFiltersApplied
                ? "No tasks match the current view."
                : "No tasks yet. Add your first task to get started."}
            </div>
          ) : (
            <ul className="task-list">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className={[
                    "task-item",
                    task.completed ? "completed" : "",
                    isOverdue(task) ? "overdue" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <label className="task-check">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggle(task)}
                    />
                    <span>{task.completed ? "Completed" : "Active"}</span>
                  </label>

                  <div className="task-content">
                    <div className="task-title-row">
                      <h3>{task.title}</h3>
                      {isOverdue(task) ? <strong>Overdue</strong> : null}
                    </div>
                    {task.description ? <p>{task.description}</p> : null}
                    <time dateTime={task.dueDate || undefined}>{formatDate(task.dueDate)}</time>
                  </div>

                  <div className="task-actions">
                    <button type="button" onClick={() => startEditing(task)}>
                      Edit
                    </button>
                    <button type="button" className="danger" onClick={() => handleDelete(task)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
