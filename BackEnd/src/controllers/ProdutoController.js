// controllers/ProdutoController.js

const ProdutoService = require("../services/ProdutoService");
const { salvarFotoBase64 } = require("../utils/base64Helper");

const path = require("path");
const fs = require("fs");

class ProdutoController {
  async listar(req, res) {
    try {
      const resultado = await ProdutoService.listarProdutos();

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async buscarPorId(req, res) {
    try {
      const resultado = await ProdutoService.buscarProdutoPorId(req.params.id);

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async cadastrar(req, res) {
    try {
      const dadosProduto = req.body || {};

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem:
            "Requisição sem corpo. Verifique Content-Type e o payload JSON.",
        });
      }

      // Se já houve upload multipart (arquivo salvo pelo middleware), `dadosProduto.foto` já estará presente
      // Upload Base64 (apenas se não houver `dadosProduto.foto` de arquivo)
      if (!dadosProduto.foto && dadosProduto.fotoBase64) {
        const uploadDir = path.join(__dirname, "..", "..", "uploads");

        // Cria pasta uploads se não existir
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, {
            recursive: true,
          });
        }

        // Salva imagem (valida e captura erro se base64 inválido)
        let nomeArquivo;
        try {
          nomeArquivo = salvarFotoBase64(dadosProduto.fotoBase64, uploadDir);
        } catch (e) {
          return res.status(400).json({
            sucesso: false,
            mensagem: "fotoBase64 inválida",
            erro: e.message || e,
          });
        }

        // adiciona no objeto
        dadosProduto.foto = nomeArquivo;

        // remove base64 gigante
        delete dadosProduto.fotoBase64;
      }

      const resultado = await ProdutoService.cadastrarProduto(dadosProduto);

      res.status(201).json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async atualizar(req, res) {
    try {
      const resultado = await ProdutoService.atualizarProduto(
        req.params.id,
        req.body,
      );

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  async deletar(req, res) {
    try {
      const resultado = await ProdutoService.deletarProduto(req.params.id);

      res.json(resultado);
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }
}

module.exports = new ProdutoController();
