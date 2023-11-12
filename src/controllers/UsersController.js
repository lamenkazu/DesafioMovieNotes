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

    await isEmailOnDB(email)

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
    const { name, email, old_password } = req.body;
    let {password} = req.body

    const selectedUser = await knex("users").where({ user_id }).first();

    await checkForUserErrors(selectedUser, email);
    if(password){
      password = await passwordValidation(password, old_password, selectedUser.password)
    }
    
    await knex("users")
      .update({
        name,
        email,
        password,
        updated_at: knex.fn.now(),
      })
      .where({ user_id });

    res.json();
  }

  async delete(req, res){
    const {user_id} = req.params

    await knex('users').where({user_id}).delete()

    res.json()
  }
}

const selectUser = ["user_id", "name", "email", "avatar", "created_at"];
const emailExistsMassage = "Esse email já está em uso por outro usuário e não pode ser utilizado."

async function checkForUserErrors(selectedUser, email) {

  if (!selectedUser) throw new AppError("Usuário não encontrado");

  const userAlredyExists = await knex("users").where({ email }).first();

  if (userAlredyExists && userAlredyExists.user_id !== selectedUser.user_id) {
    throw new AppError(emailExistsMassage);
  }
  
}

async function isEmailOnDB(email){
  const userExists = await knex("users").where({ email }).first();

  if (userExists) throw new AppError(emailExistsMassage);

  return userExists
}

async function passwordValidation(password, old_password, userPassword){
  if (password && !old_password) {
    throw new AppError("Você precisa informar a senha antiga");
  }

  if (password && old_password) {
    const checkOldPassword = await compare(
      old_password,
      userPassword
    );
    if (!checkOldPassword) {
      throw new AppError("A senha antiga não confere");
    }

    return await hash(password, 8);
  }


}

module.exports = UsersController;
