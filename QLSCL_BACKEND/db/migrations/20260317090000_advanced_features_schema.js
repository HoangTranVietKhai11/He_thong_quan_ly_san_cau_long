/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // 1. Waitlist Table
    .createTable('Waitlist', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('Users').onDelete('CASCADE');
      table.integer('court_id').unsigned().references('id').inTable('Courts').onDelete('CASCADE');
      table.date('booking_date').notNullable();
      table.time('start_time').notNullable();
      table.time('end_time').notNullable();
      table.enum('status', ['Waiting', 'Notified', 'Booking Created', 'Expired', 'Cancelled']).defaultTo('Waiting');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // 2. Recurring_Bookings Table
    .createTable('Recurring_Bookings', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('Users').onDelete('CASCADE');
      table.integer('court_id').unsigned().references('id').inTable('Courts').onDelete('CASCADE');
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
      table.string('days_of_week').notNullable(); // e.g., "1,3,5"
      table.time('start_time').notNullable();
      table.time('end_time').notNullable();
      table.enum('status', ['Active', 'Stopped']).defaultTo('Active');
      table.timestamps(true, true);
    })
    // 3. Equipment_Rentals Table
    .createTable('Equipment_Rentals', (table) => {
      table.increments('id').primary();
      table.integer('booking_id').unsigned().references('id').inTable('Bookings').onDelete('CASCADE');
      table.integer('equipment_id').unsigned().references('id').inTable('Equipments').onDelete('CASCADE');
      table.integer('quantity').defaultTo(1);
      table.decimal('price_at_rental', 15, 2).notNullable();
      table.enum('status', ['Renting', 'Returned']).defaultTo('Renting');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // 4. Price_Rules Table
    .createTable('Price_Rules', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.enum('type', ['Peak', 'Holiday', 'Member', 'Special']).defaultTo('Peak');
      table.time('start_time').nullable();
      table.time('end_time').nullable();
      table.string('days_of_week').nullable();
      table.date('specific_date').nullable();
      table.decimal('multiplier', 5, 2).defaultTo(1.0);
      table.decimal('fixed_price', 15, 2).nullable();
      table.integer('priority').defaultTo(0);
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })
    // 5. Audit_Logs Table
    .createTable('Audit_Logs', (table) => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('Users');
      table.string('action').notNullable();
      table.string('table_name').notNullable();
      table.integer('record_id');
      table.text('old_value');
      table.text('new_value');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // 6. Staff_Shifts Table
    .createTable('Staff_Shifts', (table) => {
      table.increments('id').primary();
      table.integer('staff_id').unsigned().references('id').inTable('Users');
      table.timestamp('start_time').defaultTo(knex.fn.now());
      table.timestamp('end_time').nullable();
      table.decimal('start_cash', 15, 2).defaultTo(0);
      table.decimal('end_cash', 15, 2).nullable();
      table.text('notes');
      table.enum('status', ['Open', 'Closed']).defaultTo('Open');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('Staff_Shifts')
    .dropTableIfExists('Audit_Logs')
    .dropTableIfExists('Price_Rules')
    .dropTableIfExists('Equipment_Rentals')
    .dropTableIfExists('Recurring_Bookings')
    .dropTableIfExists('Waitlist');
};
