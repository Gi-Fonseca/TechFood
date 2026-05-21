const Busboy = require("busboy");
const path = require("path");
const fs = require("fs");

module.exports = function (req, res, next) {
  const contentType = req.headers["content-type"] || "";

  if (!contentType.startsWith("multipart/form-data")) {
    return next();
  }

  const busboy = new Busboy({ headers: req.headers });

  req.body = req.body || {};
  req.files = req.files || {};

  const uploadDir = path.join(__dirname, "..", "..", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  busboy.on("file", (fieldname, file, filename /*, encoding, mimetype */) => {
    if (!filename) {
      // campo file sem arquivo
      file.resume();
      return;
    }

    const ext = path.extname(filename) || "";
    const safeName = `${Date.now()}_${fieldname}${ext}`;
    const saveTo = path.join(uploadDir, safeName);

    const writeStream = fs.createWriteStream(saveTo);
    file.pipe(writeStream);

    writeStream.on("close", () => {
      req.files[fieldname] = safeName;
      // se campo for `foto`, coloca em body para manter compatibilidade
      if (fieldname === "foto") {
        req.body.foto = safeName;
      }
    });

    writeStream.on("error", () => {
      // ignore write errors here; they'll surface later
    });
  });

  busboy.on("field", (fieldname, val) => {
    // mantém campos textuais
    req.body[fieldname] = val;
  });

  busboy.on("finish", () => {
    next();
  });

  req.pipe(busboy);
};
