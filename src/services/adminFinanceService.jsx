import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const adminFinanceService = {
    // Lấy danh sách Ví
    getAllWallets: async () => {
        return api.get(API_ENDPOINTS.ADMIN_FINANCE_WALLETS);
    },

    // Nạp tiền
    topUpWallet: async (userId, amount, description) => {
        return api.post(API_ENDPOINTS.ADMIN_FINANCE_TOPUP, { user_id: userId, amount, description });
    },

    // Lấy giao dịch
    getAllTransactions: async (type = '') => {
        return api.get(`${API_ENDPOINTS.ADMIN_FINANCE_TRANSACTIONS}?type=${type}`);
    },

    // Lấy danh sách quản lý cọc
    getDeposits: async () => {
        return api.get(API_ENDPOINTS.ADMIN_FINANCE_DEPOSITS);
    }
};

export default adminFinanceService;
