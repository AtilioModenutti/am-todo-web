import { useEffect, useState } from "react";
import { http } from "./api/http";
import './index.css'
import '@fortawesome/fontawesome-free/css/all.min.css';


export default function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editingTitle, setEditingTitle] = useState("");

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

    function startEdit(task) {
        setEditingId(task.id);
        setEditingTitle(task.title);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditingTitle("");
    }

    async function saveEdit() {
        const title = editingTitle.trim();
        if (!title) return;
        const { data } = await http.patch(`/tasks/${editingId}`, { title });
        setTasks(prev => prev.map(t => (t.id === editingId ? data : t)));
        cancelEdit();
    }

    return (
        <div className="min-h-dvh bg-gray-50">
            <div className="mx-auto max-w-2xl p-6 font-sans">
            {/* Encabezado */}
            <header className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-semibold tracking-tight"><b>ToDo List </b>- Mis tareas</h1>
                <span className="text-sm text-gray-500">
                    {tasks.length} {tasks.length === 1 ? "tarea" : "tareas"} - {tasks.filter(t => t.done).length} realizadas
                </span>
            </header>

            {/* Form agregar */}
            <form onSubmit={addTask} className="mb-6 flex gap-2">
                <label htmlFor="title" className="sr-only">Nueva tarea</label>
                <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nueva tarea…" className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 outline-none ring-indigo-200 transition focus:ring-2"/>
                <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white shadow-sm transition hover:bg-indigo-700 active:scale-[.98]" aria-label="Agregar tarea" title="Agregar tarea">
                    <i className="fa-solid fa-plus" />Agregar
                </button>
            </form>

            {/* Lista / vacío */}
            {tasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
                    <i className="fa-regular fa-rectangle-list mb-2 block text-3xl" /> No hay tareas aún. ¡Crea la primera!
                </div>
            ) : (
                <ul className="space-y-2">
                    {tasks.map(t => (
                        <li key={t.id} className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
                            <button type="button" onClick={() => toggleDone(t)} className="grid h-9 w-9 place-content-center rounded-lg border border-gray-200 transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-200" aria-label={t.done ? "Marcar como pendiente" : "Marcar como hecha"} title={t.done ? "Marcar como pendiente" : "Marcar como hecha"}>
                                {t.done ? <i className="fa-solid fa-circle-check text-green-600" /> : <i className="fa-regular fa-circle text-gray-400 group-hover:text-gray-600" />}
                            </button>

                            {editingId === t.id ? (
                                <div className="flex flex-1 items-center gap-2">
                                    <input autoFocus value={editingTitle} onChange={e => setEditingTitle(e.target.value)} onKeyDown={e => { if (e.key === "Enter") saveEdit(); if (e.key === "Escape") cancelEdit(); }} className="flex-1 rounded-lg border border-gray-300 bg-slate-100 px-3 py-2 outline-none ring-indigo-200 focus:ring-2" placeholder="Editar título…" />
                                    <button type="button" onClick={saveEdit} className="rounded-lg bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700" aria-label="Guardar" title="Guardar"><i className="fa-solid fa-check" /></button>
                                    <button type="button" onClick={cancelEdit} className="rounded-lg px-3 py-2 text-gray-600 hover:bg-gray-100" aria-label="Cancelar" title="Cancelar"><i className="fa-solid fa-xmark" /></button>
                                </div>
                            ) : (
                                <span className={`flex-1 text-[15px] ${t.done ? "text-gray-500 line-through" : "text-gray-900"}`} title={t.title}>{t.title}</span>
                            )}

                            {editingId !== t.id && (
                                <button type="button" onClick={() => startEdit(t)} className="rounded-lg p-2 text-indigo-600 transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200" aria-label="Editar tarea" title="Editar"><i className="fa-solid fa-pen" /></button>
                            )}

                            <button type="button" onClick={() => removeTask(t.id)} className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200" aria-label="Eliminar tarea" title="Eliminar" disabled={editingId === t.id}><i className="fa-solid fa-trash" /></button>
                        </li>
                    ))}
                </ul>
            )}
            </div>
        </div>
    );
}
