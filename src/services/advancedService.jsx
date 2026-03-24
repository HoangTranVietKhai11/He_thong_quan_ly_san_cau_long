import api from './api';

const advancedService = {
    // --- Waitlist ---
    addToWaitlist: (data) => api.post('/advanced/waitlist', data),
    getMyWaitlist: () => api.get('/advanced/waitlist/mine'),

    // --- Recurring ---
    createRecurring: (data) => api.post('/advanced/recurring', data),
    getMyRecurring: () => api.get('/advanced/recurring/mine'),

    // --- Pricing ---
    calculatePrice: (params) => api.get('/advanced/pricing/calculate', { params }),
    getPricingRules: () => api.get('/advanced/pricing/rules'),
    createPricingRule: (data) => api.post('/advanced/pricing/rules', data),

    // --- Audit Logs ---
    getAuditLogs: () => api.get('/advanced/logs'),
};

export default advancedService;
