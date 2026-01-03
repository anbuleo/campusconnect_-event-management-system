
import React from 'react';

const EventCard = ({ event, onClick }) => {
    const seatsLeft = event.capacity - event.registeredCount;
    const isFull = seatsLeft <= 0;

    return (
        <div
            onClick={() => onClick(event.id)}
            className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
        >
            <div className="relative h-48 overflow-hidden">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-indigo-600 shadow-sm">
                        {event.category}
                    </span>
                </div>
                {isFull && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold px-4 py-2 border-2 border-white rounded-lg">SOLD OUT</span>
                    </div>
                )}
            </div>

            <div className="p-5 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition">
                        {event.title}
                    </h3>
                </div>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                    </div>
                </div>

                <div className="mt-auto pt-4 border-t flex justify-between items-center">
                    <div className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        <span className={isFull ? "text-red-500 font-bold" : "text-emerald-500 font-bold"}>
                            {isFull ? "Full" : `${seatsLeft} Seats Left`}
                        </span>
                    </div>
                    <button className="text-indigo-600 font-semibold text-sm hover:underline">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventCard;
