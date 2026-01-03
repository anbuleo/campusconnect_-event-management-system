
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { UserRole } from './types.js';
import { api } from './services/api.js';

// Components
import Navbar from './components/Navbar.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import EventsPage from './pages/EventsPage.jsx';
import EventDetails from './pages/EventDetails.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

// Protected Route Component
const ProtectedRoute = ({ user, requiredRole, children }) => {
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (requiredRole && user.role !== requiredRole) {
        return <Navigate to="/" replace />;
    }
    return children;
};

const AppContent = () => {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchEvents = useCallback(async () => {
        const data = await api.getEvents();
        setEvents(data);
    }, []);

    useEffect(() => {
        const savedUser = localStorage.getItem('cc_auth_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        fetchEvents();
        setLoading(false);
    }, [fetchEvents]);

    useEffect(() => {
        if (user) {
            api.getNotifications(user.id).then(setNotifications);
        }
    }, [user]);

    const handleLogin = async (email) => {
        const loggedInUser = await api.login(email);
        if (loggedInUser) {
            setUser(loggedInUser);
            localStorage.setItem('cc_auth_user', JSON.stringify(loggedInUser));
            navigate('/dashboard');
        } else {
            alert("User not found! Try admin@campus.edu or student@campus.edu");
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('cc_auth_user');
        navigate('/');
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar
                user={user}
                onLogout={handleLogout}
                notificationCount={notifications.filter(n => !n.isRead).length}
            />
            <main className="flex-grow">
                <Routes>
                    <Route path="/" element={<Landing events={events.filter(e => e.status === 'APPROVED')} />} />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/events" element={<EventsPage events={events.filter(e => e.status === 'APPROVED')} />} />
                    <Route path="/events/:id" element={<EventDetails user={user} onRefresh={fetchEvents} />} />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute user={user}>
                                <Dashboard user={user} events={events} onRefresh={fetchEvents} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute user={user} requiredRole={UserRole.ADMIN}>
                                <AdminPanel user={user} events={events} onRefresh={fetchEvents} />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
            {/* <footer className="bg-white border-t py-8 px-4 text-center text-gray-500 text-sm">
                <p>© 2026 CampusConnect. Built with ❤️ for Campus Community.</p>
            </footer> */}
        </div>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
