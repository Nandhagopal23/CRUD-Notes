# 📝 CRUD Notes App

A full-stack **Notes Management Application** built using the **MERN stack** (MongoDB, Express, React, Node.js) with modern tools like **Vite** and **Tailwind CSS**. This app allows users to create, view, edit, and delete notes in a sleek, responsive interface.

---

## 🚀 Features

- ✍️ Create and manage notes with real-time updates
- 🔍 View all notes in a clean UI
- 🛠️ Edit and delete notes with instant feedback
- 🌐 RESTful API integration using **Axios**
- ⚡ Fast development with **Vite + React 19**
- 🎨 Styled with **Tailwind CSS** and **DaisyUI**
- 🔔 Toast notifications for all actions
- 📦 Modular folder structure for easy scalability

---

## ⚙️ Tech Stack

| Layer     | Tech Stack                                                  |
| --------- | ----------------------------------------------------------- |
| Frontend  | React 19, Vite, Tailwind CSS, DaisyUI, Axios                |
| Backend   | Node.js, Express.js, MongoDB, Mongoose, Zod, Helmet, Morgan |
| Routing   | React Router                                                |
| Dev Tools | ESLint, PostCSS, Lucide Icons                               |

---

## 🧪 Prerequisites

Make sure you have the following installed:

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or Atlas)

---

## Backend

- Express + MongoDB (Mongoose)
- Rate limiting via Upstash Redis
- Validation via Zod
- Security via Helmet, logging via Morgan

### Run locally

```bash
cd backend
npm install
npm run dev
```

### Environment variables

Create a `.env` in `backend/` based on the following:

```
NODE_ENV=development
PORT=5001
MONGO_URI=your_mongo_connection_string
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### API

- `GET /api/notes?page=1&limit=9` → `{ data: Note[], pagination: { page, limit, total, totalPages, hasMore } }`
- `GET /api/notes/:id`
- `POST /api/notes` `{ title, content }`
- `PUT /api/notes/:id` `{ title?, content? }`
- `DELETE /api/notes/:id`

---

## Frontend

- React + Vite + Tailwind / DaisyUI
- Axios instance with env-aware base URL
- Home has "Load more" pagination

### Run locally

```bash
cd frontend
npm install
npm run dev
```
