exports.up = function(knex) {
    return knex.schema.alterTable('Users', table => {
        table.string('phone', 15).nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.alterTable('Users', table => {
        table.dropColumn('phone');
    });
};
