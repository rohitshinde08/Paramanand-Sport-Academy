# Paramanand Sports Academy 🏅

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react&logoColor=black)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Infrastructure-Docker-2496ED?logo=docker&logoColor=white)

A premium, industry-grade sports academy platform. Built with a focus on high-end aesthetics, cinematic scroll animations, and a seamless user experience. This project serves as a complete full-stack solution featuring a public-facing dynamic website and a secure administrative dashboard.

## ✨ Key Features

- **Awwwards-Tier Animations:** Integrated with `framer-motion` and `lenis` smooth scroll physics for a cinematic browsing experience.
- **Dynamic Horizontal Scroll:** Immersive horizontal scrolling sliders for Elite Programs and Featured Sports.
- **Full-Stack Architecture:** A highly performant React frontend paired with a lightning-fast Python FastAPI backend.
- **Headless CMS / Admin Panel:** A secure admin dashboard to manage sports, coaches, testimonials, and gallery images dynamically.
- **Automated Seeding:** Built-in Python scripts to automatically seed the PostgreSQL database and copy media files on the first boot.
- **Fully Containerized:** Pre-configured with `docker-compose` and Nginx reverse proxy for instant, zero-configuration local deployment.

## 🛠 Tech Stack

### Frontend
- **React 18** (Vite)
- **Tailwind CSS** (Custom theme configured for Navy, Cyan, and Gold)
- **Framer Motion** (Complex viewport & scroll-linked animations)
- **React Lenis** (Smooth scroll physics)
- **React Router** (Client-side routing)

### Backend
- **FastAPI** (High-performance async Python framework)
- **SQLAlchemy** (Async ORM)
- **PostgreSQL** (Relational database)
- **PyJWT & Passlib** (Secure authentication and password hashing)

### Infrastructure
- **Docker & Docker Compose** (Multi-container orchestration)
- **Nginx** (Reverse proxy mapping frontend to `/` and backend API to `/api`)

---

## 🚀 Getting Started (Local Development)

The entire application is completely containerized. You do not need to install Node, Python, or PostgreSQL locally.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

### 1. Clone the repository
```bash
git clone https://github.com/rohitshinde08/Paramanand-Sport-Academy.git
cd Paramanand-Sport-Academy
```

### 2. Start the Application
Run the following command at the root of the project:
```bash
docker compose up --build
```

### 3. Access the Application
Once the containers are running, Nginx will route your traffic automatically:
- **Public Website:** [http://localhost](http://localhost)
- **Admin Dashboard:** [http://localhost/admin](http://localhost/admin)
- **API Swagger Docs:** [http://localhost/api/docs](http://localhost/api/docs)

**Default Admin Credentials:**
- **Username:** `admin`
- **Password:** `adminpassword123`

---

## 📂 Project Structure

```text
.
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # API Routers & Endpoints
│   │   ├── core/             # Security, Config, and Seed Scripts
│   │   ├── database/         # PostgreSQL Connection setup
│   │   └── models/           # SQLAlchemy DB Models
│   ├── uploads/              # Dynamically stored media files
│   └── Dockerfile            # Python Backend container build file
│
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/       # Reusable UI (Hero3D, LenisScroll, etc.)
│   │   ├── pages/            # Public & Admin Views
│   │   └── App.tsx           # React Router setup
│   ├── tailwind.config.js    # Theme tokens (Colors, Fonts)
│   └── Dockerfile            # Node build & Nginx container setup
│
├── seed-data/                # Initial images/data injected on first boot
├── docker-compose.yaml       # Multi-container orchestration
└── nginx.conf                # Reverse proxy routing rules
```

## 🗄️ Database Seeding

The application comes with an intelligent auto-seeding script (`backend/app/core/seed.py`). 
Every time the backend container starts, it checks the database. If it is empty, it automatically populates the database with default sports, coaches, and gallery images from the `/seed-data` directory. It has built-in duplicate protection, so it is 100% safe to restart the containers without corrupting the database.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
