# AM ToDo — Web (React + Vite)

SPA (Single Page App) que consume la **API Laravel** del proyecto y permite listar, crear, marcar y eliminar tareas en tiempo real.

> 🔗 Backend (API): https://github.com/AtilioModenutti/am-todo-api

---

## ✨ Características
- Listado de tareas desde la API
- Crear nueva tarea
- Marcar como hecha / deshacer
- Eliminar tarea
- Configuración por `.env` para apuntar a cualquier API

## 🧱 Stack
- React 18 + Vite
- Axios
- (Futuro) React Query / Zustand para caché y estado global

## 🧩 Arquitectura (alto nivel)
```
React (Vite)  ⇄  Axios  ⇄  Laravel API  ⇄  MySQL
```

---

## 🚀 Quick start

```bash
# 1) Clonar e instalar
git clone https://github.com/AtilioModenutti/am-todo-web.git
cd am-todo-web
npm install

# 2) Configurar URL de la API (archivo .env.local)
# Ej.: API local de Laravel con php artisan serve
echo VITE_API_URL=http://127.0.0.1:8000 > .env.local

# 3) Levantar dev server
npm run dev
# -> http://localhost:5173
```

> ✅ Si la API está corriendo y CORS configurado, verás las tareas seed iniciales.

---

## 🔧 Configuración de Axios
`src/api/http.js`:
```js
import axios from "axios";

export const http = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  timeout: 5000,
});
```

---

## 🖥️ Uso
- Abrí `http://localhost:5173`
- **Crear:** escribir título y “Agregar”
- **Marcar/Desmarcar:** click en el ícono de estado
- **Eliminar:** click en 🗑️
- Los cambios impactan directamente en la API

---

## 📁 Estructura relevante
```
src/
  api/http.js       # instancia Axios (usa VITE_API_URL)
  App.jsx           # UI principal (listar/crear/toggle/delete)
  main.jsx
index.html
```

**`App.jsx`** (flujo general):
- `useEffect` inicial para `GET /tasks?user_id=1`
- `addTask`: `POST /tasks`
- `toggleDone`: `PATCH /tasks/:id`
- `removeTask`: `DELETE /tasks/:id`

---

## 🧪 Scripts
```bash
npm run dev       # desarrollo
npm run build     # build producción
npm run preview   # preview del build
```

---
<!-- ## 🧭 Roadmap (próximos pasos)
- [ ] Manejo de loading/errores con componentes reutilizables
- [ ] React Query (caché, revalidación, estados automáticos)
- [ ] React Router (rutas y vistas separadas)
- [ ] Estilos (UI/UX): toasts, modales, componentes
- [ ] Tests de UI con Vitest + Testing Library -->

## 📜 Licencia
MIT
