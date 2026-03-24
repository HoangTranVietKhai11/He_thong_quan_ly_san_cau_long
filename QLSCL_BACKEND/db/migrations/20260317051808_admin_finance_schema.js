exports.up = function(knex) {
  return knex.schema.createTable('Transactions', table => {
    table.increments('id').primary();
    table.integer('user_id').unsigned().references('id').inTable('Users').onDelete('CASCADE');
    table.integer('booking_id').unsigned().references('id').inTable('Bookings').onDelete('SET NULL');
    table.decimal('amount', 12, 0).notNullable();
    table.string('type').notNullable(); // Deposit, Payment, Overtime, Refund, TopUp
    table.string('payment_method').defaultTo('Wallet'); // Cash, Transfer, Wallet
    table.string('status').defaultTo('Success'); // Success, Failed, Pending
    table.string('description');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  }).then(() => {
    return knex.schema.createTable('Wallets', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('Users').onDelete('CASCADE').unique();
      table.decimal('balance', 12, 0).defaultTo(0);
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
  }).then(() => {
    // Tự động tạo ví cho các user hiện có (nếu cần)
    return knex('Users').select('id').then(users => {
      const wallets = users.map(u => ({ user_id: u.id, balance: 1000000 })); // Tặng sẵn 1tr để test
      if (wallets.length > 0) {
        return knex('Wallets').insert(wallets).onConflict('user_id').ignore();
      }
    });
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('Wallets').then(() => {
    return knex.schema.dropTableIfExists('Transactions');
  });
};
