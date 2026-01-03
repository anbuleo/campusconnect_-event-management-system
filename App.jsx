
import React, { useState, useEffect, useCallback } from 'react';
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

const App = () => {
    const [user, setUser] = useState(null);
    const [currentPage, setCurrentPage] = useState('landing');
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [events, setEvents] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

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
            setCurrentPage('dashboard');
        } else {
            alert("User not found! Try admin@campus.edu or student@campus.edu");
        }
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('cc_auth_user');
        setCurrentPage('landing');
    };

    const navigateTo = (page, id) => {
        setCurrentPage(page);
        if (id) setSelectedEventId(id);
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    const renderPage = () => {
        switch (currentPage) {
            case 'landing':
                return <Landing onNavigate={navigateTo} events={events.filter(e => e.status === 'APPROVED')} />;
            case 'login':
                return <Login onLogin={handleLogin} onNavigate={navigateTo} />;
            case 'events':
                return <EventsPage onNavigate={navigateTo} events={events.filter(e => e.status === 'APPROVED')} />;
            case 'event-details':
                return <EventDetails
                    eventId={selectedEventId}
                    user={user}
                    onNavigate={navigateTo}
                    onRefresh={fetchEvents}
                />;
            case 'dashboard':
                return user ? <Dashboard user={user} events={events} onNavigate={navigateTo} onRefresh={fetchEvents} /> : <Login onLogin={handleLogin} onNavigate={navigateTo} />;
            case 'admin':
                return user?.role === UserRole.ADMIN ? <AdminPanel user={user} events={events} onRefresh={fetchEvents} /> : <Landing onNavigate={navigateTo} events={events} />;
            default:
                return <Landing onNavigate={navigateTo} events={events} />;
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar
                user={user}
                onLogout={handleLogout}
                onNavigate={navigateTo}
                notificationCount={notifications.filter(n => !n.isRead).length}
            />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <footer className="bg-white border-t py-8 px-4 text-center text-gray-500 text-sm">
                <p>© 2024 CampusConnect. Built with ❤️ for Campus Community.</p>
            </footer>
        </div>
    );
};

export default App;
