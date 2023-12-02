const fs = require("fs");
const path = require("path");
const avatarConfig = require("../configs/avatar");

class DiskStorage {
  async saveFile(file) {
    //renomeia ou move um arquivo. No caso está movendo.
    await fs.promises.rename(
      path.resolve(avatarConfig.TMP_FOLDER, file),
      path.resolve(avatarConfig.UPLOADS_FOLDER, file)
    );

    return file;
  }
  async deleteFile(file) {
    const filePath = path.resolve(avatarConfig.UPLOADS_FOLDER, file);
    try {
      //retorna o status do arquivo
      await fs.promises.stat(filePath);
    } catch {
      return;
    }

    //unlink remove o arquivo.
    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
