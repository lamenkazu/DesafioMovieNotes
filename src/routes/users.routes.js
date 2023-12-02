const { Router } = require("express");
const multer = require("multer");

const ensureAuth = require("../middlewares/ensureAuth");
const avatarConfig = require("../configs/avatar");

const UserAvatarController = require("../controllers/UserAvatarController");
const UsersController = require("../controllers/UsersController");

const usersRouter = Router();
const upload = multer(avatarConfig.MULTER);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.get("/", usersController.index);
usersRouter.post("/", usersController.create);
usersRouter.get("/:user_id", usersController.show);
usersRouter.put("/", ensureAuth, usersController.update);
usersRouter.delete("/", ensureAuth, usersController.delete);
usersRouter.patch(
  "/avatar",
  ensureAuth,
  upload.single("avatar"),
  userAvatarController.update
);

module.exports = usersRouter;
