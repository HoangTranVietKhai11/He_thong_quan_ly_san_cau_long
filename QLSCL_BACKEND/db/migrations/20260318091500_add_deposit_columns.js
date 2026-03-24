/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('Bookings', (table) => {
    table.decimal('amount_paid', 12, 2).defaultTo(0);
    table.decimal('balance_due', 12, 2).defaultTo(0);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('Bookings', (table) => {
    table.dropColumn('amount_paid');
    table.dropColumn('balance_due');
  });
};
