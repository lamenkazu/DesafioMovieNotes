const AppError = require("../utils/AppError");
const knex = require("../database");
const { hash, compare } = require("bcryptjs");

class UsersController {
  async index(req, res) {
    const { name, email } = req.query;

    const users = await knex("users")
      .select(selectUser)
      .whereLike("name", `%${name}%`)
      .andWhereLike("email", `%${email}%`)
      .orderBy("name");

    res.json(users);
  }

  async create(req, res) {
    const { name, email, password } = req.body;

    const userExists = await knex("users").where({ email });

    if (!userExists) throw new AppError("Email já em uso por outro usuário.");

    const encryptedPassword = await hash(password, 8);

    const insertedUser = await knex("users").insert({
      name,
      email,
      password: encryptedPassword,
    });

    res.json(insertedUser);
  }

  async show(req, res) {
    const { user_id } = req.params;

    const user = await knex("users").where({ user_id }).first(); //Sem isso, envia um vetor com 1 posição. Com ele, envia apenas o objeto que o vetor retornaria.

    if (user === undefined)
      throw new AppError("Esse usuário não consta no banco de dados");

    res.json(user);
  }

  async update(req, res) {
    const { user_id } = req.params;
    const { name, email, password, old_password } = req.body;

    const selectedUser = await knex("users").where({ user_id }).first();
    const userAlredyExists = await knex("users").where({ email }).first();


    checkForUserExistenceErrors(selectedUser, userAlredyExists)

    //checkForUserDataErrors(password, old_password)

    if(password && !old_password){
        throw new AppError("Você precisa informar a senha antiga")
    }

    if(password && old_password){
        const checkOldPassword = await compare(old_password, selectedUser.password)
        if(!checkOldPassword){
            throw new AppError("A senha antiga não confere")
        }

        selectedUser.password = await hash(password, 8)
    }

    await knex('users').update({
        name,
        email,
        updated_at: knex.fn.now()
    }).where({user_id})

    res.json()
    
    
  }
}

const selectUser = ["user_id", "name", "email", "avatar", "created_at"];

function checkForUserExistenceErrors(selectedUser, userAlredyExists){
    if (!selectedUser) throw new AppError("Usuário não encontrado");

    if (userAlredyExists && userAlredyExists.user_id !== selectedUser.user_id) {
        throw new AppError(
          "Esse email já está em uso por outro usuário e não pode ser utilizado."
        );
    }
    
}

module.exports = UsersController;
