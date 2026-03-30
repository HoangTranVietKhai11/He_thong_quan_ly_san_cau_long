exports.up = function(knex) {
  return knex.schema.createTable('facilities', table => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('address').notNullable();
    table.string('phone_number');
    table.string('manager_name');
    table.string('status').defaultTo('Active'); // Active, Maintenance, Closed
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  }).then(() => {
    // Thêm một cơ sở mặc định trước
    return knex('facilities').insert({
      id: 1, // Fix id to 1 to match the defaultTo(1)
      name: 'Cơ sở chính Badminton Bến Tre',
      address: 'Thành phố Bến Tre, Tỉnh Bến Tre',
      phone_number: '0833333333',
      manager_name: 'Admin'
    });
  }).then(() => {
    // Thêm cột facility_id vào bảng Courts để map court với facility
    return knex.schema.alterTable('Courts', table => {
      // Vì hệ thống hiện tại chạy 1 cụm sân, ta gán mặc định facility_id = 1 cho các sân cũ
      table.integer('facility_id').unsigned().references('id').inTable('facilities').defaultTo(1);
    });
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('Courts', table => {
    table.dropColumn('facility_id');
  }).then(() => {
    return knex.schema.dropTableIfExists('facilities');
  });
};
