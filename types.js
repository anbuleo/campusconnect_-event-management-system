

export const UserRole = {
    STUDENT: 'STUDENT',
    ADMIN: 'ADMIN'
};

export const EventStatus = {
    DRAFT: 'DRAFT',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
};

export const EventCategory = {
    TECH: 'Tech',
    SPORTS: 'Sports',
    CULTURAL: 'Cultural',
    ACADEMIC: 'Academic',
    SOCIAL: 'Social'
};

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} role - One of UserRole values
 * @property {string[]} registeredEvents - Array of event IDs
 * @property {string[]} [interests] - Array of EventCategory values
 * @property {string} joinedAt
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} organizerId
 * @property {string} organizerName
 * @property {string} date
 * @property {string} time
 * @property {string} location
 * @property {string} category - One of EventCategory values
 * @property {number} capacity
 * @property {number} registeredCount
 * @property {string} status - One of EventStatus values
 * @property {string} imageUrl
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Registration
 * @property {string} id
 * @property {string} userId
 * @property {string} eventId
 * @property {string} registeredAt
 * @property {string} userName
 * @property {string} userEmail
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} userId
 * @property {string} title
 * @property {string} message
 * @property {boolean} isRead
 * @property {string} createdAt
 */
