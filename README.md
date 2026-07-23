<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=140&section=header&text=FormDesign&fontSize=42&fontColor=FFFFFF&fontAlignY=40" width="100%"/>

<p><b>A student profile creation & management form, built with a vanilla HTML/CSS frontend and a Node.js + Express + MySQL backend.</b></p>

<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />

</div>

<br/>

## 📖 Overview

**FormDesign** is a student profile registration system for an academic institution. It provides a clean, single-page HTML form where a student can submit their personal, contact, security, and address information. Submitted data is validated and sent to an Express REST API, which securely hashes the password and stores the record in a MySQL database.

The project currently covers **two operations**:

1. **Creating** a new student profile (`POST /addStudent`)
2. **Retrieving** all stored student profiles, with passwords excluded from the response (`GET /getInfo`)

> **Scope note:** this repository implements profile *creation* and *listing* only. There is no login/authentication endpoint yet — the password field is captured and hashed (via `bcrypt`) for future use, but no session or login route currently exists.

<br/>

## 🖼️ Preview

<div align="center">
<img src="https://raw.githubusercontent.com/MosaddekHossainMehedi/FormDesign/main/Frontend/User's%20Preview.jpg" alt="Create Profile form preview" width="850"/>
</div>

<br/>

## ✨ Features

- 📝 **Structured multi-section form** — General Information, Contact Information, Security Information, and Address Information, each visually separated for clarity.
- ✅ **Server-side validation** — required fields (`firstname`, `lastname`, `department`, `idno`, `session`, `semester`, `mobile_no`, `email`, `password`) are checked before any database write.
- 🔐 **Password hashing** — passwords are hashed with `bcrypt` (10 salt rounds) before being stored; plaintext passwords are never saved.
- 🚫 **Duplicate protection** — `idno` and `email` are enforced as unique columns; duplicate submissions return a clear `409 Conflict` response instead of a silent failure or crash.
- 📡 **REST API** — a small, predictable Express API (`/addStudent`, `/getInfo`) that returns explicit HTTP status codes for success and every failure case.
- 🗄️ **Auto-provisioned schema** — the `users` table is created automatically on server start if it doesn't already exist, so there's no separate migration step.
- 🌐 **CORS-enabled** — the API can be called from a frontend served on a different origin/port.

<br/>

## 🛠️ Tech Stack & Tools

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | HTML5, CSS3 | Structure and styling of the profile creation form |
| Backend | Node.js, Express 5 | REST API server and routing |
| Database | MySQL (`mysql2` driver) | Persistent storage for student records |
| Security | bcrypt | One-way password hashing |
| Middleware | cors | Cross-origin request support |
| Dev tooling | nodemon | Auto-restarting the server during development |

<br/>

## 📂 Project Structure

```
FormDesign/
├── Frontend/
│   └── view_create_profile_page.html   # Student profile creation form (HTML + inline CSS)
├── server.js                           # Express server, MySQL connection, and API routes
├── package.json                        # Project metadata and dependencies
├── package-lock.json
└── .gitignore
```

<br/>

## ⚙️ Setup & Installation

**Prerequisites:** Node.js (v18+ recommended) and a running MySQL server.

```bash
# 1. Clone the repository
git clone https://github.com/MosaddekHossainMehedi/FormDesign.git
cd FormDesign

# 2. Install dependencies
npm install

# 3. Make sure MySQL is running locally, then start the server
npm start
# or, for auto-restart during development:
npm run dev
```

The server listens on **`http://localhost:3000`**. On first connection it automatically creates a `StudentInfo` database table named `users` if one doesn't already exist.

> By default, `server.js` connects to MySQL using `host: 'localhost'`, `user: 'root'`, and an empty password, against a database named `StudentInfo`. Update these values in `server.js` to match your local MySQL credentials before running the server.

To use the form itself, open `Frontend/view_create_profile_page.html` in a browser (or serve it statically) once the backend is running.

<br/>

## 🔌 API Reference

### Create a student profile

```
POST /addStudent
Content-Type: application/json
```

**Request body**

| Field | Type | Required |
|---|---|---|
| firstname | string | ✅ |
| lastname | string | ✅ |
| department | string | ✅ |
| idno | string | ✅ (unique) |
| session | string | ✅ |
| semester | string | ✅ |
| bloodgroup | string | optional |
| dob | date | optional |
| mobile_no | string | ✅ |
| email | string | ✅ (unique) |
| password | string | ✅ |
| presentaddress | string | optional |
| permanentaddress | string | optional |

**Responses**

| Status | Meaning |
|---|---|
| `200` | Profile created successfully |
| `400` | A required field is missing |
| `409` | A profile with this `idno` or `email` already exists |
| `500` | Server or database error |

### Fetch all student profiles

```
GET /getInfo
```

Returns a JSON array of all stored profiles. The `password` field is always excluded from the response.

| Status | Meaning |
|---|---|
| `200` | Returns the list of profiles as JSON |
| `500` | Server or database error |

<br/>

## 🗄️ Database Schema

Table: **`users`** (database: `StudentInfo`)

| Column | Type | Constraints |
|---|---|---|
| id | INT | Primary key, auto-increment |
| firstname | VARCHAR(100) | Not null |
| lastname | VARCHAR(100) | Not null |
| department | VARCHAR(50) | Not null |
| idno | VARCHAR(50) | Not null, unique |
| session | VARCHAR(50) | Not null |
| semester | VARCHAR(50) | Not null |
| bloodgroup | VARCHAR(10) | — |
| dob | DATE | — |
| mobile_no | VARCHAR(20) | Not null |
| email | VARCHAR(150) | Not null, unique |
| password | VARCHAR(255) | Not null (hashed) |
| presentaddress | TEXT | — |
| permanentaddress | TEXT | — |
| created_at | TIMESTAMP | Defaults to current time |

<br/>

## 👤 Author

**Mosaddek Hossain Mehedi**
[GitHub](https://github.com/MosaddekHossainMehedi) · [Portfolio](https://github.com/MosaddekHossainMehedi/MosaddekHossainMehedi)

<br/>

## 📄 License

Distributed under the **ISC License**, as declared in `package.json`.

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>
