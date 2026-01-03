# CampusConnect - Event Management System

A campus event management platform built for college students to discover, create, and manage campus events.

## 🎓 About

This is a college project developed for managing campus events with role-based access control. Students can browse and register for events, organizers can create and manage events, and administrators can moderate the platform.

## ✨ Features

- **Event Discovery**: Browse upcoming campus events by category (Tech, Sports, Cultural, Academic, Social)
- **Event Registration**: Register for events with capacity tracking
- **Role-Based Access**: 
  - **Students**: Browse and register for events
  - **Admins**: Create events, moderate submissions, and manage users
- **Mock Description Generator**: Template-based event descriptions
- **Responsive Design**: Mobile-friendly interface

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd campusconnect_-event-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 🧪 Demo Accounts

Try these demo accounts to explore different roles:

- **Student**: student@campus.edu
- **Admin**: admin@campus.edu

## 🛠️ Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling (via CDN)
- **LocalStorage** - Data persistence (mock backend)

## 📁 Project Structure

```
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API service (localStorage)
├── App.jsx         # Main app component
├── index.jsx       # Entry point
└── types.js        # Type definitions
```

## 🎨 Features Implemented

- Event browsing and filtering
- User authentication (mock)
- Event creation and editing
- Event approval workflow
- Registration management
- User role management
- Responsive navigation

## 📝 Notes

This is a frontend-only application using localStorage for data persistence. All data is stored in the browser and will be reset when clearing browser data.

## 👨‍💻 Author

College Student Project 

## 📄 License

This project is for educational purposes.
