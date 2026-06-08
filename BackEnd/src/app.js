const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const routes = require("./routes");



app.use(cors());

////////////////////////////// BASE 64 ////////////////////////////////////////////////////////////

// Avisa o servidor que ele pode receber textos de até 10MB (necessário para fotos em Base64)
app.use(express.json({ limit: '10mb' })); 
// Permite que o servidor entenda dados enviados por formulários comuns
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// Cria uma "ponte" para que o navegador consiga ver as fotos que estão na pasta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

////////////////////////////// BASE 64 ////////////////////////////////////////////////////////////

// Registro de todas as rotas
app.use("/", routes);

module.exports = app;

