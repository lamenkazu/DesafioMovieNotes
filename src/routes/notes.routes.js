const ensureAuth = require("../middlewares/ensureAuth");
const { Router } = require("express");
const NotesController = require("../controllers/NotesController");

const notesController = new NotesController();
const notesRouter = Router();

notesRouter.use(ensureAuth);
notesRouter.post("/", notesController.create);
notesRouter.get("/:note_id", notesController.show);
notesRouter.put("/:note_id", notesController.update);
notesRouter.delete("/:note_id", notesController.delete);
notesRouter.get("/", notesController.index);

module.exports = notesRouter;
