/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.table('Bookings', (table) => {
    table.integer('voucher_id').unsigned().nullable().references('id').inTable('Vouchers').onDelete('SET NULL');
    table.decimal('discount_amount', 12, 2).defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.table('Bookings', (table) => {
    table.dropColumn('voucher_id');
    table.dropColumn('discount_amount');
  });
};
