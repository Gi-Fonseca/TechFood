const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const routes = require("./routes");
const multipartParser = require("./middlewares/multipartParser");

// Middlewares globais
app.use(cors());

// Aumentar o limite para 10MB (CORRIGIDO)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Parser para multipart/form-data (uploads sem multer)
app.use(multipartParser);

// Servir a pasta de uploads publicamente
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Registro de todas as rotas
app.use("/", routes);

module.exports = app;
