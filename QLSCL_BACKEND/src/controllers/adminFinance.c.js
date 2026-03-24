const adminFinanceService = require('../services/adminFinance.s');
const logger = require('../utils/logger');

const getAllWallets = async (req, res) => {
  try {
    const wallets = await adminFinanceService.getAllWallets();
    res.status(200).json({ success: true, data: wallets });
  } catch (error) {
    logger.error('Error fetching wallets', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách ví' });
  }
};

const topUpWallet = async (req, res) => {
  try {
    const { user_id, amount, description } = req.body;
    if (!user_id || !amount) {
      return res.status(400).json({ success: false, message: 'Thiếu user_id hoặc amount' });
    }
    const result = await adminFinanceService.topUpWallet(user_id, amount, description);
    res.status(200).json({ success: true, message: 'Nạp tiền thành công', data: result });
  } catch (error) {
    logger.error('Error topping up wallet', error);
    res.status(500).json({ success: false, message: 'Lỗi nạp tiền' });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const { type } = req.query; // Ví dụ: ?type=Deposit
    const txs = await adminFinanceService.getAllTransactions(type);
    res.status(200).json({ success: true, data: txs });
  } catch (error) {
    logger.error('Error fetching transactions', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách giao dịch' });
  }
};

const getDeposits = async (req, res) => {
  try {
    const deposits = await adminFinanceService.getDepositTracking();
    res.status(200).json({ success: true, data: deposits });
  } catch (error) {
    logger.error('Error fetching deposits', error);
    res.status(500).json({ success: false, message: 'Lỗi lấy danh sách cọc' });
  }
};

module.exports = {
  getAllWallets,
  topUpWallet,
  getAllTransactions,
  getDeposits
};
