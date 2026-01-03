
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventCard from '../components/EventCard.jsx';

const Landing = ({ events }) => {
    const navigate = useNavigate();

    const stats = [
        { label: 'Active Events', value: events.length },
        { label: 'Total Registrations', value: events.reduce((sum, e) => sum + e.registeredCount, 0) },
        { label: 'Campus Reach', value: '95%' }
    ];

    const featuredEvents = events.slice(0, 3);

    return (
        <div className="bg-gradient-to-b from-indigo-50 to-white">
            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
                    <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                        Campus Events
                    </span>
                    <br />Made Simple
                </h1>
                <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                    Discover, register, and manage all campus activities in one place. Join the community today.
                </p>
                <div className="flex gap-4 justify-center">
                    <button onClick={() => navigate('/events')} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg">
                        Browse Events
                    </button>
                    <button onClick={() => navigate('/login')} className="bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition">
                        Get Started
                    </button>
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map(stat => (
                        <div key={stat.label} className="bg-white p-8 rounded-3xl shadow-md text-center border">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">{stat.value}</div>
                            <div className="text-gray-600 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Featured Events */}
            <section className="max-w-7xl mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold mb-8 text-center">Featured Events</h2>
                {featuredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {featuredEvents.map(event => (
                            <EventCard key={event.id} event={event} onClick={(id) => navigate(`/events/${id}`)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-500 py-20">No events available at the moment.</div>
                )}
                <div className="text-center mt-10">
                    <button onClick={() => navigate('/events')} className="text-indigo-600 font-semibold hover:underline">
                        View All Events →
                    </button>
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-7xl mx-auto px-4 py-20 text-center">
                <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to Get Involved?</h2>
                    <p className="text-lg mb-8 opacity-90">Join thousands of students experiencing campus life to the fullest.</p>
                    <button onClick={() => navigate('/login')} className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg">
                        Sign Up Now
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Landing;
