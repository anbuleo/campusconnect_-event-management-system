
import React, { useState, useMemo } from 'react';
import EventCard from '../components/EventCard.jsx';
import { CATEGORIES } from '../constants.js';

const EventsPage = ({ events, onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewMode, setViewMode] = useState('grid');

    const filteredEvents = useMemo(() => {
        return events.filter(e => {
            const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [events, searchTerm, selectedCategory]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">Campus Events</h1>
                    <p className="text-gray-500 mt-2">Find and register for upcoming activities.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full sm:w-64"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                        <option value="All">All Categories</option>
                        {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <div className="flex bg-gray-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {filteredEvents.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} onClick={(id) => onNavigate('event-details', id)} />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredEvents.map(event => (
                            <div
                                key={event.id}
                                onClick={() => onNavigate('event-details', event.id)}
                                className="bg-white p-4 rounded-xl border hover:shadow-md transition cursor-pointer flex items-center gap-4"
                            >
                                <img src={event.imageUrl} className="w-20 h-20 rounded-lg object-cover" alt="" />
                                <div className="flex-grow">
                                    <h3 className="font-bold text-lg">{event.title}</h3>
                                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                                        <span>{new Date(event.date).toLocaleDateString()}</span>
                                        <span>•</span>
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-indigo-600">{event.category}</span>
                                    <span className="text-xs text-gray-400">{event.capacity - event.registeredCount} spots left</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="text-gray-400 text-xl mb-2">No events found matching your criteria.</div>
                    <button
                        onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                        className="text-indigo-600 font-bold hover:underline"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
        </div>
    );
};

export default EventsPage;
