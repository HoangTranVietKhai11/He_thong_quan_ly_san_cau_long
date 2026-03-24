import api from './api';

const voucherService = {
    getAllVouchers: () => api.get('/vouchers'),
    getVoucherByCode: (code) => api.get(`/vouchers/code/${code}`),
    createVoucher: (data) => api.post('/vouchers', data),
    updateVoucher: (id, data) => api.put(`/vouchers/${id}`, data),
    deleteVoucher: (id) => api.delete(`/vouchers/${id}`),
    applyVoucher: (code, total) => api.post('/vouchers/apply', { code, orderTotal: total })
};

export default voucherService;
