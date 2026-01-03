
import React, { useState } from 'react';

const Login = ({ onLogin, onNavigate }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            onLogin(email);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl border shadow-xl p-10">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
                    <p className="text-gray-500 mt-2">Access the campus event portal</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. student@campus.edu"
                            className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                    >
                        Continue
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t space-y-4">
                    <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Demo Accounts</p>
                    <div className="grid grid-cols-1 gap-2">
                        {[
                            { email: 'student@campus.edu', label: 'Student Access' },
                            { email: 'admin@campus.edu', label: 'Admin Access' }
                        ].map(acc => (
                            <button
                                key={acc.email}
                                onClick={() => setEmail(acc.email)}
                                className="text-sm py-2 px-4 rounded-lg bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition text-left flex justify-between items-center"
                            >
                                <span>{acc.label}</span>
                                <span className="font-mono text-xs opacity-50">{acc.email}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
