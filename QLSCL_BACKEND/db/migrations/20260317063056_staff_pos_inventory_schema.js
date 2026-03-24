/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema
    // 1. Table Equipments
    .createTable('Equipments', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.enum('type', ['Drink', 'Shuttlecock', 'Rental', 'Other']).defaultTo('Other');
      table.decimal('price', 15, 2).notNullable().defaultTo(0);
      table.integer('stock').notNullable().defaultTo(0);
      table.integer('facility_id').unsigned().references('id').inTable('facilities').onDelete('CASCADE');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
    // 2. Table Maintenance_Logs
    .createTable('Maintenance_Logs', (table) => {
      table.increments('id').primary();
      table.integer('court_id').unsigned().notNullable().references('id').inTable('Courts').onDelete('CASCADE');
      table.string('issue', 500).notNullable();
      table.string('action_taken', 500);
      table.enum('status', ['Pending', 'In Progress', 'Completed']).defaultTo('Pending');
      table.decimal('cost', 15, 2).defaultTo(0);
      table.date('scheduled_date');
      table.date('completed_date');
      table.timestamp('created_at').defaultTo(knex.fn.now());
    })
    // 3. Update Courts Table
    .alterTable('Courts', (table) => {
      table.boolean('is_maintenance').defaultTo(false);
      table.string('maintenance_note', 500);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .alterTable('Courts', (table) => {
      table.dropColumn('is_maintenance');
      table.dropColumn('maintenance_note');
    })
    .dropTableIfExists('Maintenance_Logs')
    .dropTableIfExists('Equipments');
};
