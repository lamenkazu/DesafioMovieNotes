const AppError = require("../utils/AppError");
const knex = require("../database");

class NotesController {
  async create(req, res) {
    const user_id = req.user.id;
    const { title, description, rating, tags } = req.body;

    const user = await knex("users").where({ user_id }).first();
    if (!user)
      throw new AppError(
        "Nao é possível criar notas para um usuário que não existe."
      );

    //Insere a nota na tabela de notas
    const [note_id] = await knex("notes").insert({
      title,
      description,
      rating,
      user_id,
    });

    //Insere as tags na tabela de tags.
    const tagsInsert = tags.map((name) => ({
      note_id,
      name,
      user_id,
    }));
    await knex("tags").insert(tagsInsert);

    res.json(note_id);
  }

  async show(req, res) {
    const { note_id } = req.params;

    const note = await knex("notes").where({ note_id }).first();
    if (!note) {
      throw new AppError("Essa nota não consta no banco de dados");
    }

    const tags = await knex("tags")
      .select(["name"])
      .where({ note_id })
      .orderBy("name");

    const tagsToShow = tags.map((tag) => tag.name);

    res.json({
      ...note,
      tags: tagsToShow,
    });
  }

  async update(req, res) {
    const { note_id } = req.params;
    const { title, description, rating } = req.query;

    const note = await knex("notes").where({ note_id }).first();
    if (!note)
      throw new AppError(
        "Essa nota não existe, então não pode ser atualizada."
      );

    await knex("notes")
      .update({
        title: title === "" ? note.title : title,
        description: description === "" ? note.description : description,
        rating: rating === "" ? note.rating : rating,
        updated_at: knex.fn.now(),
      })
      .where({ note_id });

    res.json();
  }

  async delete(req, res) {
    const { note_id } = req.params;

    const note = await knex("notes").where({ note_id }).first();
    if (!note)
      throw new AppError("Essa nota não existe, então não pode ser deletada.");

    await knex("notes").where({ note_id }).delete();

    res.json();
  }

  async index(req, res) {
    const user_id = req.user.id;
    const { title, description, rating } = req.query;

    const notes = await knex("notes")
      .where("notes.user_id", user_id)
      .whereLike("title", `%${title}%`)
      .andWhereLike("description", `%${description}%`)
      .andWhereLike("rating", `%${rating}%`)
      .orderBy("title");

    res.json(notes);
  }
}

module.exports = NotesController;
