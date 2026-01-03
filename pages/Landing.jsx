
import React from 'react';
import EventCard from '../components/EventCard.jsx';

const Landing = ({ events, onNavigate }) => {
    const featuredEvents = events.slice(0, 3);

    return (
        <div className="space-y-20">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756ebafe1?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover opacity-20"
                        alt="Campus background"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
                        Connecting Campus Through <span className="text-indigo-600">Events.</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Discover technical workshops, cultural festivals, sports tournaments, and more. Your next campus memory starts here.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => onNavigate('events')}
                            className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-200"
                        >
                            Explore All Events
                        </button>
                        <button
                            onClick={() => onNavigate('login')}
                            className="bg-white text-gray-900 border-2 border-gray-100 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                    { label: 'Total Events', value: '150+' },
                    { label: 'Active Students', value: '5k+' },
                    { label: 'Organizers', value: '45' },
                    { label: 'Success Rate', value: '98%' }
                ].map((stat, i) => (
                    <div key={i} className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-3xl font-bold text-indigo-600 mb-1">{stat.value}</div>
                        <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* Featured Events */}
            <section className="max-w-7xl mx-auto px-4 pb-20">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
                        <p className="text-gray-500 mt-2">The most anticipated events on campus right now.</p>
                    </div>
                    <button
                        onClick={() => onNavigate('events')}
                        className="hidden sm:block text-indigo-600 font-bold hover:underline"
                    >
                        See All Events →
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredEvents.map(event => (
                        <EventCard key={event.id} event={event} onClick={(id) => onNavigate('event-details', id)} />
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="bg-indigo-600 py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Discover by Interest</h2>
                    <p className="text-indigo-100 mb-12">Whatever you love, we have an event for you.</p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {['Tech', 'Sports', 'Cultural', 'Academic', 'Social'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => onNavigate('events')}
                                className="bg-white/10 hover:bg-white/20 text-white px-6 py-10 rounded-2xl border border-white/20 transition backdrop-blur-sm"
                            >
                                <div className="font-bold text-xl">{cat}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
