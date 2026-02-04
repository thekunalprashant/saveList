# SaveList 🚀

**SaveList** is a unified productivity hub designed to help you focus on what actually matters. It combines task management, goal tracking, and a simple media watchlist into one beautiful, distraction-free interface.

![SaveList Hero](https://via.placeholder.com/1200x600?text=SaveList+Dashboard+Preview)

## ✨ Features

- **⏱️ Persistent Focus Timer**: Start a timer on any task. It keeps running even if you close the tab or lose internet connection.
- **🎯 Goal Tracking**: Break down ambitious goals into actionable subtasks. Visualize your progress with dynamic bars and celebrations.
- **📺 Simple Watchlist**: A clean, no-fuss list for movies and shows you want to watch. Filter by type (Movie/Show) and status (Watching/Finished).
- **🔐 Secure Authentication**: Powered by NextAuth.js (GitHub & Google Login).
- **🌗 Modern UI**: specialized interface with smooth `framer-motion` animations and glassmorphic details.
- **📱 PWA Ready**: Installable on mobile and desktop devices.
- **🔌 Offline Support**: Detects network status and keeps you informed.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: MongoDB (via Mongoose)
- **Auth**: [NextAuth.js (Auth.js)](https://authjs.dev/)
- **State Management**: Zustand
- **Styling**: CSS Modules (Vanilla CSS/Variables)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/savelist.git
cd savelist
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory (or copy `.env.example`).
You will need the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://...

# NextAuth Secret (Generate with: npx auth secret)
AUTH_SECRET=...

# OAuth Providers (Optional for local dev if using Credentials)
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## 📂 Project Structure

```
src/
├── app/                # Next.js App Router pages
│   ├── auth/           # Login/Signup pages
│   ├── goals/          # Goals feature
│   ├── landing/        # Public Landing Page
│   ├── tasks/          # Task Management feature
│   └── watchlist/      # Watchlist feature
├── components/         # Reusable UI components
│   ├── layout/         # Sidebar, Footer, Navbar
│   └── providers/      # Context providers (Auth, Theme, Toast)
├── models/             # Mongoose database models
├── store/              # Zustand global state stores
└── middleware.ts       # Auth route protection
```

## 📜 Legal

- [Privacy Policy](/src/app/privacy/page.tsx)
- [Terms of Use](/src/app/terms/page.tsx)

---

Built with ❤️ by [Kunal](https://github.com/thekunalprashant)
