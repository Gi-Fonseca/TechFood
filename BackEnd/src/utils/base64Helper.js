// utils/base64Helper.js

const fs = require('fs');
const path = require('path');

function salvarFotoBase64(base64, uploadDir) {

    const matches = base64.match(
        /^data:(image\/\w+);base64,(.+)$/
    );

    if (!matches) {
        throw new Error('Base64 inválido');
    }

    const extensao = matches[1].split('/')[1];
    const dados = matches[2];

    const nomeArquivo = `${Date.now()}.${extensao}`;

    const caminhoArquivo = path.join(
        uploadDir,
        nomeArquivo
    );

    fs.writeFileSync(
        caminhoArquivo,
        dados,
        'base64'
    );

    return nomeArquivo;
}

module.exports = {
    salvarFotoBase64
};