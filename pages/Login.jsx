
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            onLogin(email);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-3xl shadow-2xl p-8 border">
                    <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
                    <p className="text-gray-500 text-center mb-8">Sign in to access your dashboard</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="you@campus.edu"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8">
                        <p className="text-xs text-gray-400 text-center mb-4">Quick Access (Demo Accounts)</p>
                        <div className="grid grid-cols-1 gap-2">
                            {[
                                { email: 'student@campus.edu', label: 'Student Access' },
                                { email: 'admin@campus.edu', label: 'Admin Access' }
                            ].map(acc => (
                                <button
                                    key={acc.email}
                                    onClick={() => setEmail(acc.email)}
                                    className="w-full p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition text-left"
                                >
                                    <div className="font-semibold text-sm text-gray-700">{acc.label}</div>
                                    <span className="font-mono text-xs opacity-50">{acc.email}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <button onClick={() => navigate('/')} className="text-sm text-gray-500 hover:text-indigo-600">
                            ← Back to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
