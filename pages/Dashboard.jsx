
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EventCategory } from '../types.js';
import { api } from '../services/api.js';
import { CATEGORIES } from '../constants.js';

const Dashboard = ({ user, events, onRefresh }) => {
    const [showTicket, setShowTicket] = useState(null);
    const navigate = useNavigate();

    const registeredEvents = events.filter(e => user.registeredEvents.includes(e.id));
    const upcomingEvents = registeredEvents.filter(e => new Date(e.date) >= new Date());

    const handleToggleInterest = async (cat) => {
        const current = user.interests || [];
        const updated = current.includes(cat)
            ? current.filter(c => c !== cat)
            : [...current, cat];

        await api.updateInterests(user.id, updated);
        onRefresh();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">Student Dashboard</h1>
                    <p className="text-gray-500 mt-2">Personalize your experience and manage your upcoming events.</p>
                </div>
                {/* <div className="bg-white p-4 rounded-2xl border shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Interests</p>
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => {
                            const isActive = user.interests?.includes(cat);
                            return (
                                <button
                                    key={cat}
                                    onClick={() => handleToggleInterest(cat)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${isActive ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>
                </div> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Your Tickets</h2>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                {upcomingEvents.length} Active
                            </span>
                        </div>

                        {upcomingEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {upcomingEvents.map(event => (
                                    <div key={event.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition group">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                                                </svg>
                                            </div>
                                            <button
                                                onClick={() => setShowTicket(event.id)}
                                                className="text-xs font-bold text-indigo-600 hover:underline"
                                            >
                                                View Ticket
                                            </button>
                                        </div>
                                        <h3 className="font-bold text-lg mb-1 group-hover:text-indigo-600 transition">{event.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{new Date(event.date).toLocaleDateString()} • {event.location}</p>
                                        <button
                                            onClick={() => navigate(`/events/${event.id}`)}
                                            className="w-full py-2 bg-gray-50 text-gray-600 rounded-xl text-xs font-bold hover:bg-indigo-50 hover:text-indigo-600 transition"
                                        >
                                            Event Details
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium mb-4">No tickets found. Start exploring campus events!</p>
                                <button
                                    onClick={() => navigate('/events')}
                                    className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition"
                                >
                                    Discover Events
                                </button>
                            </div>
                        )}
                    </section>
                </div>

                {/* <div className="space-y-8">
                    <section className="bg-white p-6 rounded-3xl border shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Recommendations</h3>
                        <div className="space-y-4">
                            {events
                                .filter(e => !user.registeredEvents.includes(e.id) && e.status === 'APPROVED')
                                .filter(e => user.interests?.includes(e.category))
                                .slice(0, 3)
                                .map(event => (
                                    <div key={event.id} onClick={() => navigate(`/events/${event.id}`)} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0">
                                            <img src={event.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition" alt="" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold group-hover:text-indigo-600 line-clamp-1">{event.title}</h4>
                                            <p className="text-xs text-indigo-500 font-medium">{event.category}</p>
                                        </div>
                                    </div>
                                ))}
                            {(!user.interests || user.interests.length === 0) && (
                                <p className="text-xs text-gray-400 italic">Select your interests above to see personalized suggestions!</p>
                            )}
                        </div>
                    </section>
                </div> */}
            </div>

            {/* Ticket Modal */}
            {showTicket && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95">
                        <div className="bg-indigo-600 p-6 text-white text-center">
                            <h3 className="text-xl font-bold">Campus Entry Pass</h3>
                            <p className="text-indigo-200 text-xs">Present this at the venue entrance</p>
                        </div>
                        <div className="p-8 text-center">
                            <div className="bg-gray-50 p-6 rounded-2xl mb-6 inline-block">
                                {/* Mock QR Code */}
                                <div className="w-32 h-32 bg-gray-900 rounded-lg flex flex-wrap p-2 gap-1 overflow-hidden opacity-80">
                                    {Array.from({ length: 64 }).map((_, i) => (
                                        <div key={i} className={`w-3 h-3 rounded-[1px] ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
                                    ))}
                                </div>
                            </div>
                            <h4 className="font-bold text-xl mb-1">{events.find(e => e.id === showTicket)?.title}</h4>
                            <p className="text-sm text-gray-500 mb-6">{user.name} • Registered</p>
                            <div className="border-t pt-6">
                                <button
                                    onClick={() => setShowTicket(null)}
                                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition"
                                >
                                    Close Pass
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
