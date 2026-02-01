import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

// Format currency to Vietnamese Dong
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

// Format date to Vietnamese format
export const formatDate = (date, formatStr = 'dd/MM/yyyy') => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr, { locale: vi });
};

// Format date time
export const formatDateTime = (date) => {
    return formatDate(date, 'HH:mm dd/MM/yyyy');
};

// Get relative time (e.g., "2 giờ trước")
export const getRelativeTime = (date) => {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diff = Math.floor((now - dateObj) / 1000); // seconds

    if (diff < 60) return 'Vừa xong';
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
    return formatDate(dateObj);
};

// Validate email
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate Vietnamese phone number
export const isValidPhone = (phone) => {
    const phoneRegex = /^(0|\+84)[0-9]{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Validate password strength
export const validatePassword = (password) => {
    const result = {
        isValid: true,
        errors: [],
        strength: 0
    };

    if (password.length < 6) {
        result.isValid = false;
        result.errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    } else {
        result.strength += 25;
    }

    if (password.length >= 8) {
        result.strength += 25;
    }

    if (/[A-Z]/.test(password)) {
        result.strength += 25;
    } else {
        result.errors.push('Nên có ít nhất một chữ hoa');
    }

    if (/[0-9]/.test(password)) {
        result.strength += 25;
    } else {
        result.errors.push('Nên có ít nhất một chữ số');
    }

    return result;
};

// Get password strength label
export const getPasswordStrength = (strength) => {
    if (strength < 50) return { label: 'Yếu', color: 'danger' };
    if (strength < 75) return { label: 'Trung bình', color: 'warning' };
    if (strength < 100) return { label: 'Khá', color: 'info' };
    return { label: 'Mạnh', color: 'success' };
};

// Truncate text
export const truncate = (text, length = 100) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length) + '...';
};

// Generate booking ID
export const generateBookingId = () => {
    return 'BK' + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase();
};

// Calculate total price for time slots
export const calculateTotalPrice = (timeSlots, pricePerHour) => {
    return timeSlots.length * pricePerHour;
};

// Check if time slot is available
export const isTimeSlotAvailable = (slot, bookedSlots) => {
    return !bookedSlots.includes(slot);
};

// Get display name for user
export const getDisplayName = (user) => {
    if (!user) return 'Khách';
    return user.name || user.email || 'Người dùng';
};

// Get initials from name
export const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length === 1) return name.charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Debounce function
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Local storage helpers
export const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    },
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    },
    remove: (key) => {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Error removing from localStorage:', error);
        }
    },
    clear: () => {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing localStorage:', error);
        }
    }
};

// Generate star rating
export const generateStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(i <= rating ? 'star-fill' : 'star');
    }
    return stars;
};

// Parse query string
export const parseQuery = (queryString) => {
    const params = new URLSearchParams(queryString);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
};

// Build query string
export const buildQuery = (params) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
            query.append(key, params[key]);
        }
    });
    return query.toString();
};
