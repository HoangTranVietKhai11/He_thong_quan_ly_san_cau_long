import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const voucherService = {
    // Lấy tất cả voucher (Admin)
    getAllVouchers: async () => {
        return api.get(API_ENDPOINTS.VOUCHERS);
    },

    // Áp dụng voucher
    applyVoucher: async (code, order_total) => {
        return api.post(API_ENDPOINTS.VOUCHER_APPLY, { code, order_total });
    },

    // Tạo voucher mới (Admin)
    createVoucher: async (data) => {
        return api.post(API_ENDPOINTS.VOUCHERS, data);
    },

    // Cập nhật voucher (Admin)
    updateVoucher: async (id, data) => {
        return api.put(API_ENDPOINTS.VOUCHER_DETAIL(id), data);
    },

    // Xóa voucher (Admin)
    deleteVoucher: async (id) => {
        return api.delete(API_ENDPOINTS.VOUCHER_DETAIL(id));
    }
};

export default voucherService;
