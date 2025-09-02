import { useEffect, useState } from "react";
import { http } from "./api/http";

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    useEffect(() => {
        http.get("/tasks?user_id=1").then(res => setTasks(res.data));
    }, []);

    async function addTask(e) {
        e.preventDefault();
        if (!title.trim()) return;
        const { data } = await http.post("/tasks", { user_id: 1, title });
        setTasks(prev => [data, ...prev]);
        setTitle("");
    }

    async function toggleDone(task) {
        const { data } = await http.patch(`/tasks/${task.id}`, { done: !task.done });
        setTasks(prev => prev.map(t => (t.id === task.id ? data : t)));
    }

    async function removeTask(id) {
        await http.delete(`/tasks/${id}`);
        setTasks(prev => prev.filter(t => t.id !== id));
    }

    return (
        <div style={{ padding: 24, fontFamily: "system-ui", maxWidth: 640 }}>
            <h1>Mis Tareas</h1>

            <form onSubmit={addTask} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Nueva tarea…"
                style={{ flex: 1, padding: 8 }}
                />
                <button>Agregar</button>
            </form>

            <ul style={{ padding: 0, listStyle: "none" }}>
                {tasks.map(t => (
                <li key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <button onClick={() => toggleDone(t)}>{t.done ? "✅" : "⏳"}</button>
                    <span style={{ flex: 1, textDecoration: t.done ? "line-through" : "none" }}>
                    {t.title}
                    </span>
                    <button onClick={() => removeTask(t.id)}>🗑️</button>
                </li>
                ))}
            </ul>
        </div>
    );
}
