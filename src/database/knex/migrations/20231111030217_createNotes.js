
exports.up = knex => knex.schema.createTable('notes', table => {

    table.increments("note_id")
    table.text("title")
    table.text("description")
    table.integer("rating")
    
    table.integer("user_id").references("user_id").inTable("users")

    table.timestamp("created_at").default(knex.fn.now())
    table.timestamp("updated_at").default(knex.fn.now())
});

exports.down = knex => knex.schema.createTable('notes');
