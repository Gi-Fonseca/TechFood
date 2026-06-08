
// URL da API — altere aqui se mudar de porta ou ambiente
const API_URL = "http://localhost:3000/produtos";
 
// Variável que guarda a string base64 da imagem selecionada.
// Fica fora das funções para ser acessada tanto pelo FileReader
// quanto pela função de envio.
let imagemBase64 = "";
 
document.addEventListener("DOMContentLoaded", function () {
  configurarFoto();
  configurarContadorDescricao();
  configurarLimpar();
  configurarCadastrar();
});
 
 
function configurarFoto() {
  const inputFoto        = document.querySelector("#input-foto");
  const btnEscolher      = document.querySelector("#btn-escolher-foto");
  const previewContainer = document.querySelector("#preview-container");
  const previewImg       = document.querySelector("#preview-imagem");
  const placeholder      = document.querySelector("#placeholder-foto");
  const infoFoto         = document.querySelector("#info-foto");
 
  if (!inputFoto) return;
 
  // Tanto o botão quanto clicar direto no preview abrem o seletor de arquivo
  btnEscolher.addEventListener("click", function () {
    inputFoto.click();
  });
  previewContainer.addEventListener("click", function () {
    inputFoto.click();
  });
 
  inputFoto.addEventListener("change", function () {
    const arquivo = inputFoto.files[0];
    if (!arquivo) return;
 
    // Validação de tamanho — 5 MB = 5 * 1024 * 1024 bytes
    const MAX_BYTES = 5 * 1024 * 1024;
    if (arquivo.size > MAX_BYTES) {
      mostrarToast("Imagem muito grande! Máximo permitido: 5 MB.", "erro");
      inputFoto.value = ""; // reseta o input
      return;
    }
 
    // FileReader converte o arquivo para base64
    const reader = new FileReader();
 
    reader.addEventListener("load", function () {
      // reader.result = "data:image/jpeg;base64,ABC123..."
      imagemBase64 = reader.result;
 
      // Exibe o preview e esconde o placeholder
      previewImg.src = imagemBase64;
      previewImg.style.display = "block";
      placeholder.style.display = "none";
 
      // Atualiza texto informativo com o nome do arquivo
      if (infoFoto) {
        infoFoto.textContent = "✔ " + arquivo.name;
      }
    });
 
    reader.readAsDataURL(arquivo);
  });
}
 

function configurarContadorDescricao() {
  const textarea = document.querySelector("#input-descricao");
  const contador = document.querySelector("#contador-descricao");
  if (!textarea || !contador) return;
 
  textarea.addEventListener("input", function () {
    contador.textContent = textarea.value.length + " / 300";
  });
}
 
 
// ─────────────────────────────────────────────────────────────────────────────
// configurarLimpar()
// Reseta todos os campos e a imagem de volta ao estado inicial.
// ─────────────────────────────────────────────────────────────────────────────
function configurarLimpar() {
  const btn = document.querySelector("#btn-limpar-form");
  if (!btn) return;
 
  btn.addEventListener("click", function () {
    resetarFormulario();
  });
}
 
 
// ─────────────────────────────────────────────────────────────────────────────
// configurarCadastrar()
// Coleta os valores, valida e chama enviarProduto().
// ─────────────────────────────────────────────────────────────────────────────
function configurarCadastrar() {
  const btn = document.querySelector("#btn-cadastrar");
  if (!btn) return;
 
  btn.addEventListener("click", function () {
    const nome      = document.querySelector("#input-nome").value.trim();
    const descricao = document.querySelector("#input-descricao").value.trim();
    const preco     = parseFloat(document.querySelector("#input-preco").value);
    const categoria = document.querySelector("#input-categoria").value;
 
    // Validação dos campos obrigatórios
    if (!nome) {
      mostrarToast("Informe o nome do prato.", "erro");
      document.querySelector("#input-nome").focus();
      return;
    }
    if (!categoria) {
      mostrarToast("Selecione uma categoria.", "erro");
      document.querySelector("#input-categoria").focus();
      return;
    }
    if (isNaN(preco) || preco <= 0) {
      mostrarToast("Informe um preço válido.", "erro");
      document.querySelector("#input-preco").focus();
      return;
    }
 
    // Monta o objeto que será enviado como JSON para a API.
    // imagemBase64 pode ser string vazia se nenhuma foto foi selecionada.
    const produto = {
    nome: nome,
    descricao: descricao,
    preco: preco,
    categoria: categoria,
    fotoBase64: imagemBase64
};

console.log("Produto enviado:", produto);

enviarProduto(produto);
 
  });
}
 
 
// ─────────────────────────────────────────────────────────────────────────────
// enviarProduto(produto)
// Faz POST para /produtos com o objeto em JSON.
// Mesma estrutura de fetch usada no api.js do projeto.
// ─────────────────────────────────────────────────────────────────────────────
function enviarProduto(produto) {
  const btn = document.querySelector("#btn-cadastrar");
 
  // Desabilita o botão durante o envio para evitar cliques duplos
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Enviando...";
  }
 
  fetch(API_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(produto)
  })
    .then(function (resposta) {
      if (!resposta.ok) {
        // Tenta ler a mensagem de erro que o backend possa ter enviado
        return resposta.json().then(function (err) {
          throw new Error(err.message || "Erro ao cadastrar produto.");
        });
      }
      return resposta.json();
    })
    .then(function () {
      mostrarToast("Prato cadastrado com sucesso! 🎉", "sucesso");
      resetarFormulario();
    })
    .catch(function (erro) {
      console.error("Erro ao cadastrar produto:", erro);
      mostrarToast("Erro: " + erro.message, "erro");
    })
    .finally(function () {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "✓ Cadastrar Prato";
      }
    });
}
 
// ─────────────────────────────────────────────────────────────────────────────
// resetarFormulario()
// Limpa campos, preview e a variável imagemBase64.
// Chamado após cadastro bem-sucedido ou pelo botão Limpar.
// ─────────────────────────────────────────────────────────────────────────────
function resetarFormulario() {
  document.querySelector("#input-nome").value      = "";
  document.querySelector("#input-descricao").value = "";
  document.querySelector("#input-preco").value     = "";
  document.querySelector("#input-categoria").value = "";
  document.querySelector("#input-foto").value      = "";
  document.querySelector("#contador-descricao").textContent = "0 / 300";
 
  const previewImg  = document.querySelector("#preview-imagem");
  const placeholder = document.querySelector("#placeholder-foto");
  const infoFoto    = document.querySelector("#info-foto");
 
  previewImg.src          = "";
  previewImg.style.display  = "none";
  placeholder.style.display = "block";
 
  if (infoFoto) infoFoto.textContent = "JPG, PNG ou WEBP • máx. 5 MB";
 
  // Reseta a variável global da imagem
  imagemBase64 = "";
}
 
// ─────────────────────────────────────────────────────────────────────────────
// mostrarToast(mensagem, tipo)
// Exibe feedback visual sem usar alert().
// tipo: "sucesso" (verde) ou "erro" (vermelho) — definido no cadastro.css
// Some automaticamente após 3,5 segundos.
// ─────────────────────────────────────────────────────────────────────────────
function mostrarToast(mensagem, tipo) {
  const toast = document.querySelector("#toast-cadastro");
  if (!toast) return;
 
  toast.textContent  = mensagem;
  toast.className    = "toast " + tipo + " visivel";
 
  // Remove a classe "visivel" após 3,5s — o CSS cuida da animação de saída
  setTimeout(function () {
    toast.className = "toast"; //Toast Info
  }, 3500);
}