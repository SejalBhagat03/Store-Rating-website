# Store Rating Platform

A full-stack web application that allows users to rate stores and view store ratings.  
The system includes three roles: **Admin**, **Normal User**, and **Store Owner**, each with different permissions and dashboards.

---

## 🚀 Features

### 🔑 Authentication
- Login & Logout
- Signup for Normal Users
- Role-based access control
- Password update functionality

### 👤 Normal User
- View all stores
- Search stores by name or address
- Submit ratings (1–5)
- Update previously submitted ratings
- View overall rating of each store

### 👑 Admin
- Dashboard with key statistics:
  - Total Users
  - Total Stores
  - Total Ratings
- Add new users (Admin, User, Store Owner)
- Add new stores
- View & manage user list (with filtering and sorting)
- View & manage store list (with filtering and sorting)

### 🏪 Store Owner
- View users who rated their store
- See store’s average rating

---

## 🛠️ Tech Stack

### **Frontend**
- React + Vite
- TypeScript
- TailwindCSS
- shadcn/ui components
- React Router

### **Other Libraries**
- Radix UI primitives
- React Hook Form + Zod validation
- React Query for data fetching
- Lucide Icons

---

## 📂 Folder Structure
src/
components/
pages/
layouts/
hooks/
services/
utils/
public/

---

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
