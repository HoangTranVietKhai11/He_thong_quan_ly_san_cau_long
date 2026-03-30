/**
 * Fix Unique Constraint so Cancelled bookings don't block new ones
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Xóa rào cản Unique cứng ngắc cũ ngăn chung mọi status
  await knex.schema.alterTable('Bookings', (table) => {
    table.dropUnique(['court_id', 'booking_date', 'start_time']);
  });

  // Tạo Partial Index: Chỉ cấm trùng lịch nếu Booking đó CHƯA bị hủy
  await knex.raw(`
    CREATE UNIQUE INDEX "Bookings_active_unique" 
    ON "Bookings" (court_id, booking_date, start_time) 
    WHERE status != 'Cancelled'
  `);
};

exports.down = async function(knex) {
  await knex.raw(`DROP INDEX "Bookings_active_unique"`);

  await knex.schema.alterTable('Bookings', (table) => {
    table.unique(['court_id', 'booking_date', 'start_time']);
  });
};
