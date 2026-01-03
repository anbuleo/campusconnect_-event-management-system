
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';

const EventDetails = ({ user, onRefresh }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            const allEvents = await api.getEvents();
            const found = allEvents.find(e => e.id === id);
            if (found) setEvent(found);
        };
        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (!event) return;
        const timer = setInterval(() => {
            const target = new Date(event.date + 'T' + event.time).getTime();
            const now = new Date().getTime();
            const diff = target - now;
            if (diff <= 0) {
                setTimeLeft(null);
                clearInterval(timer);
            } else {
                setTimeLeft({
                    d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                    s: Math.floor((diff % (1000 * 60)) / 1000)
                });
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [event]);

    const handleRegister = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsRegistering(true);
        const success = await api.registerForEvent(user.id, id);
        if (success) {
            alert("Successfully registered!");
            onRefresh();
            const allEvents = await api.getEvents();
            setEvent(allEvents.find(e => e.id === id) || null);
        } else {
            alert("Registration failed or already registered.");
        }
        setIsRegistering(false);
    };

    const handleUnregister = async () => {
        if (!user) return;
        if (window.confirm("Are you sure you want to cancel your registration?")) {
            await api.unregisterFromEvent(user.id, id);
            onRefresh();
            const allEvents = await api.getEvents();
            setEvent(allEvents.find(e => e.id === id) || null);
        }
    };

    const handleAddToCalendar = () => {
        if (!event) return;
        const title = encodeURIComponent(event.title);
        const details = encodeURIComponent(event.description);
        const location = encodeURIComponent(event.location);
        const dateStr = event.date.replace(/-/g, '');
        const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dateStr}T090000Z/${dateStr}T170000Z`;
        window.open(googleCalendarUrl, '_blank');
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: event?.title,
                text: event?.description,
                url: window.location.href,
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    if (!event) return <div className="p-20 text-center">Loading event details...</div>;

    const isRegistered = user?.registeredEvents.includes(event.id);
    const isFull = event.registeredCount >= event.capacity;

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-8">
                <button onClick={() => navigate('/events')} className="flex items-center text-indigo-600 font-bold hover:translate-x-[-4px] transition-transform">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Events
                </button>
                <div className="flex gap-2">
                    <button onClick={handleShare} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    </button>
                    <button onClick={handleAddToCalendar} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl border shadow-xl overflow-hidden">
                <div className="h-96 relative">
                    <img src={event.imageUrl} className="w-full h-full object-cover" alt={event.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-10 left-10">
                        <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full mb-4 inline-block">{event.category}</span>
                        <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
                        <p className="text-white/80 flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            {event.location}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-10">
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Description</h2>
                            <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>
                        </section>
                        <section className="bg-gray-50 p-6 rounded-2xl border flex items-center">
                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-4">{event.organizerName[0]}</div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium">Host</p>
                                <p className="font-bold text-gray-900">{event.organizerName}</p>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-2xl border-2 border-indigo-50 shadow-sm sticky top-24">
                            {timeLeft && (
                                <div className="mb-6">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Countdown</p>
                                    <div className="grid grid-cols-4 gap-2 text-center">
                                        {[{ v: timeLeft.d, l: 'D' }, { v: timeLeft.h, l: 'H' }, { v: timeLeft.m, l: 'M' }, { v: timeLeft.s, l: 'S' }].map(t => (
                                            <div key={t.l} className="bg-indigo-600 text-white p-2 rounded-lg">
                                                <div className="text-lg font-bold">{t.v}</div>
                                                <div className="text-[8px]">{t.l}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Date</span><span className="font-bold">{new Date(event.date).toLocaleDateString()}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Availability</span><span className="font-bold text-emerald-600">{event.capacity - event.registeredCount} spots</span></div>
                            </div>
                            {isRegistered ? (
                                <button onClick={handleUnregister} className="w-full py-4 bg-emerald-50 text-emerald-700 rounded-xl font-bold transition hover:bg-red-50 hover:text-red-700">Cancel Registration</button>
                            ) : (
                                <button disabled={isFull || isRegistering} onClick={handleRegister} className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition transform active:scale-95 ${isFull ? "bg-gray-200 text-gray-400" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200"}`}>
                                    {isRegistering ? "Wait..." : isFull ? "Fully Booked" : "Get My Ticket"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetails;
