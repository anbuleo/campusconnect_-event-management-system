
import { UserRole, EventStatus, EventCategory } from '../types.js';
import { MOCK_IMAGES } from '../constants.js';

const USERS_KEY = 'cc_users';
const EVENTS_KEY = 'cc_events';
const REGS_KEY = 'cc_registrations';
const NOTIFS_KEY = 'cc_notifications';

const INITIAL_USERS = [
    { id: '1', name: 'Admin Sarah', email: 'admin@campus.edu', role: UserRole.ADMIN, registeredEvents: [], joinedAt: '2023-01-15' },
    { id: '3', name: 'Alex Student', email: 'student@campus.edu', role: UserRole.STUDENT, registeredEvents: ['e1', 'e3', 'e5'], interests: [EventCategory.TECH, EventCategory.SOCIAL], joinedAt: '2024-02-20' },
];

const INITIAL_EVENTS = [
    {
        id: 'e1',
        title: 'Tech Innovation Summit 2024',
        description: 'Join industry professionals and engineers for a deep dive into emerging technologies and software development. Networking and refreshments provided.',
        organizerId: '1',
        organizerName: 'Admin Sarah',
        date: '2024-12-05',
        time: '10:00',
        location: 'Science Hub Room 402',
        category: EventCategory.TECH,
        capacity: 120,
        registeredCount: 85,
        status: EventStatus.APPROVED,
        imageUrl: MOCK_IMAGES[0],
        createdAt: '2024-10-01T09:00:00Z',
    },
    {
        id: 'e2',
        title: 'Inter-College Basketball Finals',
        description: 'The ultimate showdown between the Faculty of Arts and the Faculty of Engineering. Come support your team!',
        organizerId: '1',
        organizerName: 'Admin Sarah',
        date: '2024-11-28',
        time: '17:30',
        location: 'Campus Arena',
        category: EventCategory.SPORTS,
        capacity: 500,
        registeredCount: 412,
        status: EventStatus.APPROVED,
        imageUrl: MOCK_IMAGES[1],
        createdAt: '2024-10-05T14:30:00Z',
    },
    {
        id: 'e3',
        title: 'Symphony of Colors: Art Exhibition',
        description: 'A curated showcase of student art ranging from digital illustrations to classical oil paintings.',
        organizerId: '1',
        organizerName: 'Arts Department',
        date: '2024-12-12',
        time: '11:00',
        location: 'Main Gallery Hall',
        category: EventCategory.CULTURAL,
        capacity: 200,
        registeredCount: 120,
        status: EventStatus.APPROVED,
        imageUrl: MOCK_IMAGES[2],
        createdAt: '2024-10-10T11:00:00Z',
    },
    {
        id: 'e4',
        title: 'Data Science Bootcamp',
        description: 'A weekend intensive workshop covering Python, Pandas, and Scikit-Learn for beginners.',
        organizerId: '1',
        organizerName: 'Admin Sarah',
        date: '2024-11-20',
        time: '09:00',
        location: 'Lab 12B',
        category: EventCategory.ACADEMIC,
        capacity: 40,
        registeredCount: 40,
        status: EventStatus.APPROVED,
        imageUrl: MOCK_IMAGES[3],
        createdAt: '2024-10-12T08:00:00Z',
    },
    {
        id: 'e5',
        title: 'Winter Social & Networking',
        description: 'End the semester with music, food, and networking with alumni and industry partners.',
        organizerId: '1',
        organizerName: 'Campus Life Office',
        date: '2024-12-20',
        time: '19:00',
        location: 'Student Union Lounge',
        category: EventCategory.SOCIAL,
        capacity: 300,
        registeredCount: 155,
        status: EventStatus.APPROVED,
        imageUrl: MOCK_IMAGES[4],
        createdAt: '2024-10-15T16:00:00Z',
    },
    {
        id: 'e6',
        title: 'Crypto & Web3 Workshop',
        description: 'Learn the fundamentals of blockchain technology and smart contract development.',
        organizerId: '1',
        organizerName: 'Admin Sarah',
        date: '2024-12-01',
        time: '14:00',
        location: 'Seminar Hall 2',
        category: EventCategory.TECH,
        capacity: 60,
        registeredCount: 0,
        status: EventStatus.PENDING,
        imageUrl: MOCK_IMAGES[0],
        createdAt: '2024-10-25T10:00:00Z',
    },
    {
        id: 'e7',
        title: 'Chess Championship 2024',
        description: 'Annual rapid chess tournament open to all skill levels. Trophies for top 3!',
        organizerId: '1',
        organizerName: 'Admin Sarah',
        date: '2024-11-15',
        time: '10:00',
        location: 'Library Wing A',
        category: EventCategory.SPORTS,
        capacity: 32,
        registeredCount: 10,
        status: EventStatus.DRAFT,
        imageUrl: MOCK_IMAGES[1],
        createdAt: '2024-10-28T12:00:00Z',
    }
];

const INITIAL_REGS = [
    { id: 'r1', userId: '3', eventId: 'e1', registeredAt: '2024-10-02T10:00:00Z', userName: 'Alex Student', userEmail: 'student@campus.edu' },
    { id: 'r2', userId: '3', eventId: 'e3', registeredAt: '2024-10-11T14:20:00Z', userName: 'Alex Student', userEmail: 'student@campus.edu' },
    { id: 'r3', userId: '3', eventId: 'e5', registeredAt: '2024-10-16T11:00:00Z', userName: 'Alex Student', userEmail: 'student@campus.edu' },
];

const INITIAL_NOTIFS = [
    { id: 'n1', userId: '3', title: 'Registration Confirmed', message: 'You are now registered for the Tech Innovation Summit!', isRead: false, createdAt: '2024-10-02T10:00:00Z' },
    { id: 'n2', userId: '3', title: 'New Event Recommendation', message: 'A new Tech event "Crypto Workshop" was just added.', isRead: true, createdAt: '2024-10-26T09:00:00Z' },
];

class APIService {
    getStorage(key, initial) {
        const data = localStorage.getItem(key);
        if (!data) {
            localStorage.setItem(key, JSON.stringify(initial));
            return initial;
        }
        return JSON.parse(data);
    }

    setStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Auth & Users
    async login(email) {
        const users = this.getStorage(USERS_KEY, INITIAL_USERS);
        return users.find(u => u.email === email) || null;
    }

    async getUsers() {
        return this.getStorage(USERS_KEY, INITIAL_USERS);
    }

    async updateUserRole(userId, role) {
        const users = await this.getUsers();
        this.setStorage(USERS_KEY, users.map(u => u.id === userId ? { ...u, role } : u));
    }

    async updateInterests(userId, interests) {
        const users = await this.getUsers();
        this.setStorage(USERS_KEY, users.map(u => u.id === userId ? { ...u, interests } : u));
    }

    // Events
    async getEvents() {
        return this.getStorage(EVENTS_KEY, INITIAL_EVENTS);
    }

    async createEvent(eventData) {
        const events = await this.getEvents();
        const newEvent = {
            ...eventData,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            registeredCount: 0
        };
        this.setStorage(EVENTS_KEY, [...events, newEvent]);
        return newEvent;
    }

    async updateEventStatus(id, status) {
        const events = await this.getEvents();
        this.setStorage(EVENTS_KEY, events.map(e => e.id === id ? { ...e, status } : e));
    }

    // Registrations & Attendees
    async registerForEvent(userId, eventId) {
        const regs = this.getStorage(REGS_KEY, INITIAL_REGS);
        const users = await this.getUsers();
        const currentUser = users.find(u => u.id === userId);
        if (!currentUser || regs.some(r => r.userId === userId && r.eventId === eventId)) return false;

        const newReg = {
            id: Date.now().toString(),
            userId,
            eventId,
            registeredAt: new Date().toISOString(),
            userName: currentUser.name,
            userEmail: currentUser.email
        };
        this.setStorage(REGS_KEY, [...regs, newReg]);

        const events = await this.getEvents();
        this.setStorage(EVENTS_KEY, events.map(e => e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e));
        this.setStorage(USERS_KEY, users.map(u => u.id === userId ? { ...u, registeredEvents: [...u.registeredEvents, eventId] } : u));
        return true;
    }

    async unregisterFromEvent(userId, eventId) {
        const regs = this.getStorage(REGS_KEY, INITIAL_REGS);
        this.setStorage(REGS_KEY, regs.filter(r => !(r.userId === userId && r.eventId === eventId)));
        const events = await this.getEvents();
        this.setStorage(EVENTS_KEY, events.map(e => e.id === eventId ? { ...e, registeredCount: Math.max(0, e.registeredCount - 1) } : e));
        const users = await this.getUsers();
        this.setStorage(USERS_KEY, users.map(u => u.id === userId ? { ...u, registeredEvents: u.registeredEvents.filter(id => id !== eventId) } : u));
    }

    async getAttendees(eventId) {
        const regs = this.getStorage(REGS_KEY, INITIAL_REGS);
        return regs.filter(r => r.eventId === eventId);
    }

    // Notifications
    async getNotifications(userId) {
        const all = this.getStorage(NOTIFS_KEY, INITIAL_NOTIFS);
        return all.filter(n => n.userId === userId);
    }
}

export const api = new APIService();
