const db = require('../config/db.config');

const adminFinanceService = {
  // 1. Quản lý Ví (Wallets)
  getAllWallets: async () => {
    return db('Wallets')
      .join('Users', 'Wallets.user_id', 'Users.id')
      .select('Wallets.id', 'Wallets.balance', 'Wallets.updated_at', 'Users.id as user_id', 'Users.username as full_name', 'Users.email')
      .orderBy('Wallets.balance', 'desc');
  },

  topUpWallet: async (userId, amount, description) => {
    return db.transaction(async trx => {
      // Tìm ví
      const wallet = await trx('Wallets').where('user_id', userId).first();
      let newBalance = amount;
      
      if (wallet) {
        newBalance = parseFloat(wallet.balance) + parseFloat(amount);
        await trx('Wallets').where('user_id', userId).update({ balance: newBalance, updated_at: db.fn.now() });
      } else {
        await trx('Wallets').insert({ user_id: userId, balance: newBalance });
      }

      // Lưu giao dịch
      const [txId] = await trx('Transactions').insert({
        user_id: userId,
        amount: amount,
        type: 'TopUp',
        status: 'Success',
        description: description || 'Admin nạp tiền vào ví',
        payment_method: 'Transfer'
      }).returning('id');

      return { balance: newBalance, transaction_id: txId.id || txId };
    });
  },

  // 2. Quản lý Giao dịch (Transactions)
  getAllTransactions: async (type = null) => {
    let query = db('Transactions')
      .join('Users', 'Transactions.user_id', 'Users.id')
      .select(
        'Transactions.*',
        'Users.username as full_name',
        'Users.email'
      )
      .orderBy('Transactions.created_at', 'desc');
    
    if (type) {
      query = query.where('Transactions.type', type);
    }
    return query;
  },

  // 3. Theo dõi tiền cọc (Deposits) - Lấy lịch sử cọc của bookings
  getDepositTracking: async () => {
    return db('Transactions')
      .join('Users', 'Transactions.user_id', 'Users.id')
      .leftJoin('Bookings', 'Transactions.booking_id', 'Bookings.id')
      .where('Transactions.type', 'Deposit')
      .select(
        'Transactions.id',
        'Transactions.amount',
        'Transactions.status',
        'Transactions.created_at',
        'Transactions.payment_method',
        'Users.username as full_name',
        'Users.email',
        'Bookings.id as booking_id',
        'Bookings.status as booking_status'
      )
      .orderBy('Transactions.created_at', 'desc');
  }
};

module.exports = adminFinanceService;
