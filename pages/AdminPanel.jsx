
import React, { useState, useEffect } from 'react';
import { EventStatus, UserRole, EventCategory } from '../types.js';
import { api } from '../services/api.js';
import { CATEGORIES, MOCK_IMAGES } from '../constants.js';

const AdminPanel = ({ user, events, onRefresh }) => {
    const [activeTab, setActiveTab] = useState('moderation');
    const [users, setUsers] = useState([]);
    const [selectedAttendees, setSelectedAttendees] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: EventCategory.TECH,
        capacity: 50,
    });

    useEffect(() => {
        if (activeTab === 'users') {
            api.getUsers().then(setUsers);
        }
    }, [activeTab]);

    const pendingEvents = events.filter(e => e.status === EventStatus.PENDING);
    const otherEvents = events.filter(e => e.status !== EventStatus.PENDING && e.status !== EventStatus.DRAFT);
    const myEvents = events.filter(e => e.organizerId === user.id);

    const handleStatusUpdate = async (id, status) => {
        await api.updateEventStatus(id, status);
        onRefresh();
    };

    const handleRoleUpdate = async (userId, newRole) => {
        await api.updateUserRole(userId, newRole);
        api.getUsers().then(setUsers);
    };

    const handleGenerateDescription = () => {
        if (!formData.title) return alert("Enter a title first!");

        // Mock description templates based on category
        const templates = {
            'Tech': `Join us for an exciting ${formData.title} event! Dive deep into the latest technologies, network with fellow enthusiasts, and enhance your technical skills. Perfect for students passionate about innovation.`,
            'Sports': `Get ready for ${formData.title}! This thrilling sports event brings together athletes and fans for an unforgettable experience. Don't miss the action-packed competition and team spirit!`,
            'Cultural': `Experience the vibrant ${formData.title} celebration! Immerse yourself in art, music, and cultural diversity. A wonderful opportunity to celebrate our heritage and creativity together.`,
            'Academic': `Enhance your knowledge at ${formData.title}. This academic event features expert speakers, interactive workshops, and valuable learning opportunities for all students.`,
            'Social': `Come together for ${formData.title}! A fantastic social gathering to meet new people, have fun, and create lasting memories with your campus community.`
        };

        const desc = templates[formData.category] || `Join us for an exciting ${formData.title} event on campus!`;
        setFormData(prev => ({ ...prev, description: desc }));
    };

    const handleSubmit = async (status) => {
        if (!formData.title || !formData.date) return alert("Please fill title and date.");
        await api.createEvent({
            ...formData,
            organizerId: user.id,
            organizerName: user.name,
            imageUrl: MOCK_IMAGES[Math.floor(Math.random() * MOCK_IMAGES.length)],
            status
        });
        alert(status === EventStatus.PENDING ? "Event created and approved!" : "Saved to drafts!");
        setFormData({
            title: '',
            description: '',
            date: '',
            time: '',
            location: '',
            category: EventCategory.TECH,
            capacity: 50,
        });
        setActiveTab('my-events');
        onRefresh();
    };

    const viewAttendees = async (event) => {
        const list = await api.getAttendees(event.id);
        setSelectedAttendees({ eventTitle: event.title, list });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">Admin Panel</h1>
                    <p className="text-gray-500 mt-2">Manage events, users, and campus content.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl flex-wrap gap-1">
                    <button
                        onClick={() => setActiveTab('moderation')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'moderation' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                    >
                        Moderation
                    </button>
                    <button
                        onClick={() => setActiveTab('my-events')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'my-events' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                    >
                        My Events
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'create' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                    >
                        Create Event
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${activeTab === 'users' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500'}`}
                    >
                        Users
                    </button>
                </div>
            </div>

            {activeTab === 'moderation' && (
                <div className="space-y-12">
                    <section>
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            Awaiting Approval
                            <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingEvents.length}</span>
                        </h2>
                        {pendingEvents.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingEvents.map(event => (
                                    <div key={event.id} className="bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col">
                                        <div className="h-32 relative">
                                            <img src={event.imageUrl} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className="p-5 flex-grow">
                                            <div className="text-[10px] font-bold text-indigo-600 uppercase mb-1">{event.category}</div>
                                            <h3 className="font-bold text-lg mb-4">{event.title}</h3>
                                            <div className="text-xs text-gray-500 space-y-1 mb-6">
                                                <p>Organizer: <span className="font-bold text-gray-900">{event.organizerName}</span></p>
                                                <p>Location: {event.location}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={() => handleStatusUpdate(event.id, EventStatus.APPROVED)} className="flex-1 bg-emerald-600 text-white py-2 rounded-xl text-xs font-bold hover:bg-emerald-700 transition">Approve</button>
                                                <button onClick={() => handleStatusUpdate(event.id, EventStatus.REJECTED)} className="flex-1 bg-red-50 text-red-600 border border-red-100 py-2 rounded-xl text-xs font-bold hover:bg-red-100 transition">Reject</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed text-gray-400">Queue is empty.</div>
                        )}
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-6">All Events Status</h2>
                        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-4 text-left font-bold text-gray-400 uppercase text-[10px]">Event</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-400 uppercase text-[10px]">Organizer</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-400 uppercase text-[10px]">Status</th>
                                        <th className="px-6 py-4 text-right font-bold text-gray-400 uppercase text-[10px]">Toggle</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {otherEvents.map(event => (
                                        <tr key={event.id} className="hover:bg-gray-50 transition">
                                            <td className="px-6 py-4 font-bold text-gray-900">{event.title}</td>
                                            <td className="px-6 py-4 text-gray-500">{event.organizerName}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${event.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleStatusUpdate(event.id, event.status === 'APPROVED' ? EventStatus.REJECTED : EventStatus.APPROVED)}
                                                    className={`text-xs font-bold hover:underline ${event.status === 'APPROVED' ? 'text-red-500' : 'text-emerald-600'}`}
                                                >
                                                    {event.status === 'APPROVED' ? 'Revoke' : 'Restore'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'my-events' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Events', val: myEvents.length, color: 'indigo' },
                            { label: 'Live Events', val: myEvents.filter(e => e.status === 'APPROVED').length, color: 'emerald' },
                            { label: 'Pending', val: myEvents.filter(e => e.status === 'PENDING').length, color: 'amber' },
                            { label: 'Drafts', val: myEvents.filter(e => e.status === 'DRAFT').length, color: 'gray' }
                        ].map(stat => (
                            <div key={stat.label} className="bg-white p-5 rounded-2xl border flex flex-col items-center">
                                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</span>
                                <span className={`text-2xl font-bold text-${stat.color}-600`}>{stat.val}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold text-gray-400 uppercase tracking-widest text-[10px]">Event Details</th>
                                    <th className="px-6 py-4 text-left font-bold text-gray-400 uppercase tracking-widest text-[10px]">Status</th>
                                    <th className="px-6 py-4 text-left font-bold text-gray-400 uppercase tracking-widest text-[10px]">Attendance</th>
                                    <th className="px-6 py-4 text-right font-bold text-gray-400 uppercase tracking-widest text-[10px]">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {myEvents.map(event => (
                                    <tr key={event.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{event.title}</div>
                                            <div className="text-xs text-gray-400">{event.date} • {event.location}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${event.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                                                    event.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {event.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-gray-100 h-1 rounded-full overflow-hidden">
                                                    <div className="bg-indigo-600 h-full" style={{ width: `${(event.registeredCount / event.capacity) * 100}%` }}></div>
                                                </div>
                                                <span className="text-[10px] font-bold">{event.registeredCount}/{event.capacity}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => viewAttendees(event)} className="text-indigo-600 font-bold hover:underline text-xs">View Attendees</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'create' && (
                <div className="max-w-2xl mx-auto bg-white rounded-3xl border shadow-xl p-8">
                    <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Title</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border rounded-xl" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
                                <select className="w-full px-4 py-2 border rounded-xl" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Capacity</label>
                                <input type="number" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="w-full px-4 py-2 border rounded-xl" required />
                            </div>
                            <div className="col-span-2">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-700">Description</label>
                                    <button type="button" onClick={handleGenerateDescription} className="text-xs text-indigo-600 font-bold hover:underline flex items-center">
                                        ✨ Generate Description
                                    </button>
                                </div>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-xl h-24" required />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
                                <input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                                <input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                <input type="text" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-2 border rounded-xl" />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button type="button" onClick={() => handleSubmit(EventStatus.DRAFT)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition">Save Draft</button>
                            <button type="button" onClick={() => handleSubmit(EventStatus.APPROVED)} className="flex-1 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition">Create & Approve</button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'users' && (
                <section>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-3xl border shadow-sm">
                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Users</div>
                            <div className="text-3xl font-bold">{users.length}</div>
                        </div>
                        <div className="bg-white p-6 rounded-3xl border shadow-sm">
                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-1">Admins</div>
                            <div className="text-3xl font-bold text-indigo-600">{users.filter(u => u.role === UserRole.ADMIN).length}</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-4 text-left font-bold text-gray-400 uppercase text-[10px]">User</th>
                                    <th className="px-6 py-4 text-left font-bold text-gray-400 uppercase text-[10px]">Current Role</th>
                                    <th className="px-6 py-4 text-left font-bold text-gray-400 uppercase text-[10px]">Joined At</th>
                                    <th className="px-6 py-4 text-right font-bold text-gray-400 uppercase text-[10px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{u.name}</div>
                                            <div className="text-[10px] text-gray-400">{u.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${u.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-xs">{u.joinedAt || '2024-01-01'}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            {u.role === UserRole.STUDENT && (
                                                <button
                                                    onClick={() => handleRoleUpdate(u.id, UserRole.ADMIN)}
                                                    className="text-indigo-600 text-xs font-bold hover:underline"
                                                >
                                                    Make Admin
                                                </button>
                                            )}
                                            {u.role === UserRole.ADMIN && (
                                                <button
                                                    onClick={() => handleRoleUpdate(u.id, UserRole.STUDENT)}
                                                    className="text-gray-500 text-xs font-bold hover:underline"
                                                >
                                                    Make Student
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* Attendee List Modal */}
            {selectedAttendees && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4">
                        <div className="p-6 border-b flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold">Attendees</h3>
                                <p className="text-gray-400 text-xs">{selectedAttendees.eventTitle}</p>
                            </div>
                            <button onClick={() => setSelectedAttendees(null)} className="text-gray-400 hover:text-gray-900">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-2">
                            {selectedAttendees.list.length > 0 ? (
                                <div className="space-y-1">
                                    {selectedAttendees.list.map(reg => (
                                        <div key={reg.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">{reg.userName[0]}</div>
                                                <div>
                                                    <div className="text-sm font-bold">{reg.userName}</div>
                                                    <div className="text-[10px] text-gray-400">{reg.userEmail}</div>
                                                </div>
                                            </div>
                                            <div className="text-[10px] text-gray-400">Registered {new Date(reg.registeredAt).toLocaleDateString()}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-10 text-center text-gray-400 italic">No registrations yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
