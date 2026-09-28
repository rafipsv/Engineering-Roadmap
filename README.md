# 2-Year Software Engineering Operating System

> **"Learn it. Build it. Prove it."**  
> A disciplined, production-grade 24-month roadmap designed to master Mobile, Backend, Android, CS Core, System Design, and Production Engineering — with protected rest and demonstrable proof of competence.

---

![Roadmap Version](https://img.shields.io/badge/Version-2.0_Modular-indigo)
![Duration](https://img.shields.io/badge/Duration-24_Months_/_104_Weeks-blue)
![Phases](https://img.shields.io/badge/Phases-8_Phases-emerald)
![Projects](https://img.shields.io/badge/Build_Track-63_Projects-purple)
![DSA Practice](https://img.shields.io/badge/DSA_Practice-1220+_Problems-amber)
![Friday Policy](https://img.shields.io/badge/Friday-Protected_OFF_Day-green)

---

## 🎯 Core Engineering Principles

1. **Depth Over Tool Collecting:** Master fundamentals, architecture, and internals instead of just chasing framework syntax.
2. **AI Assists; Understanding Remains Yours:** Use AI tools for velocity and review, but ensure every algorithm, architecture decision, and line of code is genuinely understood.
3. **Prerequisites Before Shortcuts:** Solidify foundations before advancing to complex distributed systems or frameworks.
4. **Sustainable Rhythm Beats Burnout:** 90–120 minutes daily from **Saturday to Thursday**.
5. **Friday Is 100% Protected:** Mandatory rest day dedicated to family, personal life, and mental recovery. No catch-up study tasks.
6. **Every Month Leaves Evidence:** Every topic concludes with a demonstrable mini-project, unit tests, or working code repository.

---

## 🗺️ 8-Phase Curriculum Overview

| Phase | Phase Title | Duration | Core Focus & Milestones |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Foundation Reset** | Months 01–03 *(W001–W013)* | Dart internals, OOP, Collections, Math foundations, and basic DSA (Arrays, Strings, Recursion). |
| **Phase 2** | **Flutter Engineering** | Months 04–06 *(W014–W026)* | Widget tree & rendering, State Management (BLoC/Riverpod), Networking, Clean Architecture, and Testing. |
| **Phase 3** | **Backend & Data** | Months 07–09 *(W027–W039)* | Node.js, Express, REST APIs, PostgreSQL, SQL indexing, Redis caching, and auth security. |
| **Phase 4** | **Native Android** | Months 10–12 *(W040–W052)* | Kotlin, Jetpack Compose, Coroutines, Room DB, Retrofit, Dependency Injection (Hilt), and Clean Architecture. |
| **Phase 5** | **Computer Science Core** | Months 13–15 *(W053–W065)* | Computer Networking (TCP/IP, HTTP/3), Operating Systems (Processes, Threads, Memory), Advanced DSA. |
| **Phase 6** | **System Design** | Months 16–18 *(W066–W078)* | Scalability, Distributed Systems, Load Balancers, Queues (Kafka/RabbitMQ), Database Sharding, Dynamic Programming. |
| **Phase 7** | **Engineering Depth & DevOps**| Months 19–21 *(W079–W091)* | Docker, Linux CLI, CI/CD pipelines, Cloud architectures (GCP/AWS), Observability, and Security hardening. |
| **Phase 8** | **Interview & Career Mastery** | Months 22–24 *(W092–W104)* | Mock interview drills, System Design case studies, DSA pattern revisions, and GitHub portfolio polish. |

---

## ✨ Web Application Features

The accompanying interactive dashboard is built with **modern ES Modules, zero build-step overhead, and an Obsidian Slate design system**:

- 📅 **Weekly Planner:**
  - 104 individual week cards with clean, non-overwhelming summary pills (`📖 Topics`, `🧩 DSA Solved`, `🚀 Project`, `🏆 Deliverable`).
  - Interactive **Dropdown Filters** (Filter by Phase with completion %, Month with %, and Status).
- 🧩 **Progressive DSA Bank (1,220+ Curated Problems across 20 Topics):**
  - Problems are strictly tiered by complexity:
    - **Foundational Topics (Math, Complexity):** 30 problems each
    - **Bitwise & State Masking:** 40 problems
    - **Core Structures (Hashing, Linked List):** 50 problems each
    - **Standard Patterns (Arrays, Binary Search, Two Pointers, Stack/Queue, Trees, Heap, Trie, DSU, Greedy, Backtracking):** 60 problems each
    - **Hard Algorithms (Shortest Path, Graphs, Segment Trees):** 70–80 problems each
    - **Deep Dynamic Programming (DP I & DP II):** 100 problems each
  - Every problem features a verified direct link to **Codeforces**, **HackerRank**, or **LeetCode**.
  - Individual checkboxes with automatic `localStorage` synchronization and progress tracking.
- 🚀 **63 In-Depth Project Specifications:**
  - Clickable project links across all views opening a dedicated **Project Details Modal**.
  - Includes full specification: **4-item key feature checklists**, **recommended architecture**, **technology stack**, and **expected deliverables**.
  - Covers modern real-world systems: **AI/LLM Semantic Vector Search (pgvector & RAG)**, **Distributed Rate Limiter & Caching (Redis)**, **OpenTelemetry Observability Stack**, **Event-Driven Message Queues (Kafka/RabbitMQ)**, and algorithmic engines.
- 📋 **Dependencies & Prerequisites Matrix:**
  - Clean prerequisite tracking table ensuring foundational skills are solidified before advanced topics.
- 💾 **Local Persistence & Backup:**
  - Automatic `localStorage` synchronization.
  - One-click **Save `progress.json`** file download and **Import `progress.json`** for safe backup across machines.
- 🌓 **Obsidian Slate Minimalist Theme:**
  - Clean dark/light mode toggle with high-contrast, accessible typography.

---

## ⚡ Daily & Weekly Study Rhythm

```text
Saturday – Thursday (90–120 Minutes Daily):
┌─────────────────────────────────────────────────────────────┐
│ 1. [30–45 min] DSA & Problem Solving (CF / HR / LC)         │
│ 2. [45–75 min] Syllabus Learning / Hands-on Project Build  │
└─────────────────────────────────────────────────────────────┘

Friday:
┌─────────────────────────────────────────────────────────────┐
│ 🛡️ 100% OFF — Family, Personal Life & Mental Recovery      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ How to Run Locally

Because the application fetches `data/curriculum.json` and `data/progress.json` asynchronously using browser-native ES Modules, serve the folder with any local HTTP server:

### Option 1: VS Code Live Server (Recommended)
1. Open the project folder in VS Code.
2. Right-click `index.html` and select **Open with Live Server**.

### Option 2: Node.js (npx serve / http-server)
```bash
npx serve .
# or
npx http-server -p 8080 .
```

### Option 3: Python 3
```bash
python3 -m http.server 8080
```
Open **`http://127.0.0.1:8080`** in your browser.

---

## 📂 Project Architecture

```text
├── index.html               # Semantic HTML5 Application Shell
├── styles.css               # Obsidian Slate Minimalist Design System & CSS Variables
├── README.md                # Engineering OS Documentation
├── data/
│   ├── curriculum.json      # 104 Weeks, 54 Projects & 225+ Problems Database
│   └── progress.json        # User progress tracking source of truth
└── js/
    ├── app.js               # Application Orchestrator & Bootloader
    ├── state.js             # Central State Store (C, P, Filters, Search)
    ├── utils.js             # Helpers, Formatters, Category Badges & Storage Sync
    ├── events.js            # DOM Event Handlers & Keyboard Shortcuts
    ├── modals/
    │   ├── workspaceModal.js# 4-Step Weekly Workspace Popup (Problem links & notes)
    │   └── projectModal.js  # Dedicated 4-Point Project Feature & Architecture Modal
    └── views/
        ├── dashboard.js     # Metrics, Hero Target & Full-width Phase Map
        ├── roadmap.js       # 24-Month Roadmap Journey
        ├── weekly.js        # Weekly Planner & Filter Toolbar
        ├── practice.js      # DSA Problem-Solving Bank by Topic
        ├── projects.js      # Build Track / Projects Grid
        ├── dependencies.js  # Prerequisites & Dependencies Table
        └── strategy.js      # Rules, Philosophy & Weekly Rhythm
```

---

## 💾 Progress Backup Workflow

1. Check off completed DSA questions, projects, and weeks as you progress.
2. Your progress is saved automatically to your browser storage.
3. Periodically click **"Save progress.json"** in the sidebar to download a timestamped backup.
4. When switching machines or browsers, click **"Import progress.json"** to restore your complete history.

---

*Crafted with focus, discipline, and commitment to engineering excellence.*
