require("express-async-errors");
const AppError = require("./utils/AppError");

const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");

const avatarConfig = require("./configs/avatar");

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);
app.use("/files", express.static(avatarConfig.UPLOADS_FOLDER));

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.log(error);

  return res.status(500).json({
    status: "error",
    message: "Erro interno do servidor",
  });
});

const port = 3333;
app.listen(port, () => console.log(`app listening on port ${port}!`));
