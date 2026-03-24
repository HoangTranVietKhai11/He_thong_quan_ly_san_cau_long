/**
 * Migration: Extend schema for Staff/Admin features
 * - Add description, image_url to Courts
 * - Add check_in_time, actual_end_time, status_normalized to Bookings
 * - Create Vouchers table
 * - Create CheckIns table
 */
exports.up = async function(knex) {
  // 1. Thêm cột vào Courts
  await knex.schema.alterTable('Courts', (table) => {
    table.text('description').nullable();
    table.string('image_url').nullable();
  });

  // 2. Thêm cột vào Bookings
  await knex.schema.alterTable('Bookings', (table) => {
    table.timestamp('check_in_time').nullable();
    table.timestamp('check_out_time').nullable();
    table.time('actual_end_time').nullable();
    table.integer('extend_minutes').defaultTo(0);
    table.decimal('extend_fee', 12, 2).defaultTo(0);
    table.string('notes').nullable();
  });

  // 3. Tạo bảng Vouchers
  await knex.schema.createTable('Vouchers', (table) => {
    table.increments('id').primary();
    table.string('code').notNullable().unique();
    table.enum('discount_type', ['percent', 'fixed']).defaultTo('percent');
    table.decimal('value', 10, 2).notNullable();
    table.decimal('min_order', 12, 2).defaultTo(0);
    table.integer('max_uses').defaultTo(100);
    table.integer('used_count').defaultTo(0);
    table.date('expiry_date').nullable();
    table.enum('status', ['Active', 'Inactive']).defaultTo('Active');
    table.timestamps(true, true);
  });

  // 4. Tạo bảng CheckIns
  await knex.schema.createTable('CheckIns', (table) => {
    table.increments('id').primary();
    table.integer('booking_id').unsigned().references('id').inTable('Bookings').onDelete('CASCADE');
    table.integer('staff_id').unsigned().references('id').inTable('Users');
    table.timestamp('check_in_time').defaultTo(knex.fn.now());
    table.timestamp('check_out_time').nullable();
    table.string('notes').nullable();
    table.timestamps(true, true);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('CheckIns');
  await knex.schema.dropTableIfExists('Vouchers');
  await knex.schema.alterTable('Bookings', (table) => {
    table.dropColumn('check_in_time');
    table.dropColumn('check_out_time');
    table.dropColumn('actual_end_time');
    table.dropColumn('extend_minutes');
    table.dropColumn('extend_fee');
    table.dropColumn('notes');
  });
  await knex.schema.alterTable('Courts', (table) => {
    table.dropColumn('description');
    table.dropColumn('image_url');
  });
};
