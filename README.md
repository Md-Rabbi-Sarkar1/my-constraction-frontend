# Construction Management System (CMS) - Frontend Dashboard

This repository houses the client-side user interface for the Construction Management System. It delivers real-time project tracking, inventory dashboards, and dynamic log reporting for field workers and project managers.

## 🛠️ Tech Stack

* **Framework:** React.js with Vite
* **Styling & UI Components:** Tailwind CSS & Shadcn UI
* **State Management & Data Fetching:** TanStack Query (React Query) & Zustand
* **Routing:** React Router DOM
* **Form Handling & Validation:** React Hook Form & Zod

## 📂 Core Frontend Features & Views

The frontend applies strict **Role-Based Access Control (RBAC)** to match backend permissions, dynamically rendering UI elements based on the authenticated user's role (Admin, Project Manager, or Field Contractor).

### 🔑 Authentication & Portal Access
* **Login / Registration Screens:** Standard secure authentication forms utilizing session persistence via JWT tokens.
* **Protected Routes:** Route guards preventing unauthorized clients from viewing restricted administrative panels.

### 📊 Dashboards & Analytics
* **Manager Terminal:** High-level project metrics including budget burn rates, overall material status, and construction milestones.
* **Contractor Mobile Feed:** A streamlined, mobile-responsive view optimized for field workers to log updates quickly.

### 🏗️ Projects & Milestones View
* **Milestone Timeline:** An interactive timeline tracking active building phases and upcoming operational goals.
* **Project Manager Control Board:** Form elements allowing managers to append new project phases directly to the system.

### 📦 Materials & Site Inventory
* **Inventory Tracker:** A comprehensive database grid showing global counts of raw materials.
* **Deduction Interface:** A simple interactive prompt enabling field supervisors to log daily raw material usages.

### 📝 Daily Work Logs
* **Daily Report Wizard:** A comprehensive, multi-step digital submission form used by contractors to log site documentation.

## ⚙️ Getting Started

### Prerequisites
* Node.js installed locally (v18+ recommended).
* The CMS Backend API running locally or hosted externally.

### Installation & Run

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install client dependencies:
   ```bash
   npm install
   ```

3. Configure your Environment Variables:
   Create a `.env.local` file in the root of this folder:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```

4. Spin up the local development server:
   ```bash
   npm run dev
   ```

The frontend application will initialize at [http://localhost:5173](http://localhost:5173).
