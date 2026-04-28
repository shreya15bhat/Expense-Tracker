# Premium MERN Expense Tracker

A feature-rich, production-ready expense tracking application.

## Key Features
- **Secure Authentication**: JWT-based login and registration.
- **Dynamic Dashboard**: Interactive charts (Pie & Bar) for financial insights using Recharts.
- **Full CRUD**: Manage income and expenses with categorical and monthly filtering.
- **MVC Architecture**: Clean backend structure for scalability.
- **Premium UI**: Glassmorphic design with smooth animations via Framer Motion.
- **In-Memory Fallback**: Automatically uses an in-memory DB if local MongoDB is unavailable (perfect for demos).

## Project Structure
- `/backend`: Node.js/Express API with MVC pattern.
- `/frontend`: React + Vite frontend with modular components.

## Prerequisites
- Node.js 18+
- MongoDB (optional, falls back to in-memory DB if not found)

## Quick Start (Root)
1. Install all dependencies:
   ```bash
   npm run install-all
   ```
2. Run both frontend and backend concurrently:
   ```bash
   npm run dev
   ```

## Production Deployment
The project is configured for deployment (e.g., to Render, Heroku, or Vercel).
1. The backend is set up to serve the frontend's production build.
2. Set `NODE_ENV=production` on your hosting platform.
3. Build the project:
   ```bash
   npm run build
   ```

## API Routes
- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/profile`
- **Expenses**: `/api/expenses` (GET, POST, PUT, DELETE)

## Screenshots
The app features a stunning dark-mode dashboard with real-time financial tracking.
