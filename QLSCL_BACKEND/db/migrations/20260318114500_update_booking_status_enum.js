/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.raw(`
    ALTER TABLE "Bookings" DROP CONSTRAINT IF EXISTS "Bookings_status_check";
    ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_status_check" 
    CHECK (status IN ('Pending', 'Partially Paid', 'Fully Paid', 'Active', 'Cancelled', 'Confirmed'));
  `);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.raw(`
    ALTER TABLE "Bookings" DROP CONSTRAINT IF EXISTS "Bookings_status_check";
    ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_status_check" 
    CHECK (status IN ('Pending', 'Partially Paid', 'Fully Paid', 'Active', 'Cancelled'));
  `);
};
