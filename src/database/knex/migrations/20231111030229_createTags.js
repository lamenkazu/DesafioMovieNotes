
exports.up = knex => knex.schema.createTable("tags", table => {
  
    table.increments("tag_id")
    table.text("name").notNullable()

    table.integer("user_id").references("user_id").inTable("users")
    table.integer("note_id").references("note_id").inTable("notes").onDelete("CASCADE")



});

exports.down = knex => knex.schema.dropTable('tags');
