
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types.js';
import { APP_NAME } from '../constants.js';

const Navbar = ({ user, onLogout, notificationCount }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                            {APP_NAME}
                        </span>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => navigate('/events')} className="text-gray-600 hover:text-indigo-600 font-medium">Events</button>
                        {user && (
                            <>
                                <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-indigo-600 font-medium">My Dashboard</button>
                                {user.role === UserRole.ADMIN && (
                                    <button onClick={() => navigate('/admin')} className="text-gray-600 hover:text-indigo-600 font-medium">Admin Panel</button>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    {/* <svg className="w-6 h-6 text-gray-500 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg> */}
                                    {/* {notificationCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                            {notificationCount}
                                        </span>
                                    )} */}
                                </div>
                                <div className="flex items-center space-x-3 bg-gray-100 px-3 py-1.5 rounded-full">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                                        {user.name[0]}
                                    </div>
                                    <span className="hidden lg:block text-sm font-semibold text-gray-700">{user.name}</span>
                                    <button
                                        onClick={onLogout}
                                        className="text-xs text-red-500 hover:underline font-medium"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-indigo-700 transition shadow-sm"
                            >
                                Login
                            </button>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t px-4 py-4 space-y-4">
                    <button onClick={() => { navigate('/events'); setIsOpen(false); }} className="block w-full text-left font-medium py-2">Events</button>
                    {user && (
                        <button onClick={() => { navigate('/dashboard'); setIsOpen(false); }} className="block w-full text-left font-medium py-2">My Dashboard</button>
                    )}
                    {!user && (
                        <button onClick={() => { navigate('/login'); setIsOpen(false); }} className="block w-full text-left font-medium py-2">Login</button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
