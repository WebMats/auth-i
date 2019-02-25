
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users' ,function (tbl) {
    tbl
        .increment()
        .notNullable();
    tbl
        .string('email', 128)
        .unique()
        .notNullable();
    tbl
        .string('hash', 255)
        .notNullable()
  })
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('users');
};
