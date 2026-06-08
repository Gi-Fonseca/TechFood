// controllers/ProdutoController.js

// Importa o serviço de banco de dados e o nosso tradutor de fotos
const ProdutoService = require("../services/ProdutoService");
const { salvarFotoBase64 } = require("../utils/base64Helper");

const path = require("path");
const fs = require("fs");

class ProdutoController {
  // MÉTODO PARA LISTAR TODOS OS PRODUTOS
  async listar(req, res) {
    try {
      const resultado = await ProdutoService.listarProdutos();
      res.json(resultado); // Envia a lista para o Front-End
    } catch (erro) {
      res.status(erro.status || 500).json({
        sucesso: false,
        mensagem: erro.mensagem || "Erro interno do servidor",
        erro: erro.stack || erro,
      });
    }
  }

  // MÉTODO PARA BUSCAR UM PRODUTO ESPECÍFICO PELO ID
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

  // MÉTODO PARA CADASTRAR UM NOVO PRODUTO (COM FOTO)
  async cadastrar(req, res) {
    try {
      const dadosProduto = req.body || {}; // Pega os dados que vieram do formulário

      // Verifica se o formulário não veio vazio
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          sucesso: false,
          mensagem: "Requisição sem corpo. Verifique Content-Type e o payload JSON.",
        });
      }

      // --- LÓGICA DE UPLOAD DA FOTO (BASE64) ---
      // Se o usuário enviou uma foto em formato de texto (Base64)...
      if (!dadosProduto.foto && dadosProduto.fotoBase64) {
        // Define onde a foto vai morar (pasta uploads na raiz do projeto)
        const uploadDir = path.join(__dirname, "..", "..", "uploads");

        // Se a pasta de fotos não existir, o sistema cria ela agora
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, {
            recursive: true,
          });
        }

        // Tenta salvar a foto usando o tradutor e pega o nome gerado
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

        // Salva apenas o nome da foto nos dados que vão para o banco
        dadosProduto.foto = nomeArquivo;

        // Apaga o texto gigante (Base64) para o sistema não ficar pesado
        delete dadosProduto.fotoBase64;
      }

      // Envia o produto completo para ser guardado definitivamente no banco
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

  // MÉTODO PARA ATUALIZAR OS DADOS DE UM PRODUTO
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

  // MÉTODO PARA EXCLUIR UM PRODUTO DO SISTEMA
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

// Exporta o controlador pronto para ser usado pelas rotas
module.exports = new ProdutoController();