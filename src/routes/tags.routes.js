const ensureAuth = require("../middlewares/ensureAuth");
const { Router } = require("express");
const usersRouter = Router();

const TagsController = require("../controllers/TagsController.js");
const tagsController = new TagsController();

usersRouter.get("/", ensureAuth, tagsController.index);

module.exports = usersRouter;
