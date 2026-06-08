document.addEventListener("DOMContentLoaded", function () {
  renderizarCardapio();
  inicializarHoverCards();
  inicializarVitrine();
  atualizarContadorPedidos();
});

async function renderizarCardapio() {
  const grid = document.querySelector("#grid-cardapio");
  if (!grid) return;

  grid.innerHTML = "<p class='loading'>Carregando cardápio...</p>";

  try {
    const produtos = await buscarProdutos();
    grid.innerHTML = "";

    produtos.forEach(function (produto) {
      const card = document.createElement("article");
      card.classList.add("card");
      card.setAttribute("data-id", produto.id);

      const urlServidor = "http://localhost:3000/uploads/";
      const imgSrc = produto.foto
        ? urlServidor + produto.foto
        : "https://via.placeholder.com/300x200?text=Sabor+Digital";

      card.innerHTML =
        `<img src="${imgSrc}" alt="${produto.nome}" class="card-img">` +
        `<h3>${produto.nome}</h3>` +
        `<p class='desc'>${produto.descricao}</p>` +
        `<div class='quantidade-box'>` +
          `<button class='btn-qtd btn-menos'>-</button>` +
          `<span class='qtd-valor'>1</span>` +
          `<button class='btn-qtd btn-mais'>+</button>` +
        `</div>` +
        `<span class='preco' data-preco='${produto.preco}'>` +
          `R$ ${parseFloat(produto.preco).toFixed(2).replace(".", ",")}` +
        `</span>` +
        `<button class='btn-pedido'>Pedir Agora</button>`;

      grid.appendChild(card);
    });
  } catch (erro) {
    grid.innerHTML = "<p class='loading erro'>Erro ao carregar o cardápio. Verifique se o servidor está rodando.</p>";
  }
}

function inicializarHoverCards() {
  const cards = document.querySelectorAll(".card");

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "none";
    });
  });
}

function inicializarVitrine() {
  const main = document.querySelector("main");
  if (!main) return;

  main.addEventListener("click", function (event) {
    const clicado = event.target;

    if (clicado.classList.contains("btn-menos")) {
      const box = clicado.parentElement;
      const spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Math.max(1, Number(spanQtd.textContent) - 1);
      atualizarPrecoCard(box);
      return;
    }

    if (clicado.classList.contains("btn-mais")) {
      const box = clicado.parentElement;
      const spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Number(spanQtd.textContent) + 1;
      atualizarPrecoCard(box);
      return;
    }

    if (clicado.classList.contains("btn-pedido")) {
      event.preventDefault();
      const card = clicado.parentElement;
      const produtoId = Number(card.getAttribute("data-id"));
      const quantidade = Number(card.querySelector(".qtd-valor").textContent);

      salvarPedido(produtoId, quantidade, clicado);
    }
  });
}

function atualizarPrecoCard(box) {
  const card = box.parentElement;
  const spanPreco = card.querySelector(".preco");
  const precoUnitario = parseFloat(spanPreco.getAttribute("data-preco"));
  const quantidade = Number(box.querySelector(".qtd-valor").textContent);
  const total = precoUnitario * quantidade;

  spanPreco.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  spanPreco.style.color = total > 150 ? "#c0392b" : "#e67e22";
}

function salvarPedido(produtoId, quantidade, botao) {
  const card = botao.parentElement;
  const nome = card.querySelector("h3").textContent;
  const preco = parseFloat(card.querySelector(".preco").getAttribute("data-preco"));
  const subtotal = preco * quantidade;

  const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
  lista.push({
    produto_id: produtoId,
    quantidade,
    nome,
    preco,
    subtotal,
  });
  localStorage.setItem("techfood_pedidos", JSON.stringify(lista));

  botao.textContent = "✓ Adicionado!";
  botao.style.backgroundColor = "#27ae60";
  botao.disabled = true;

  atualizarContadorPedidos();

  setTimeout(function () {
    botao.textContent = "Pedir Agora";
    botao.style.backgroundColor = "";
    botao.disabled = false;

    const box = card.querySelector(".quantidade-box");
    if (box) {
      box.querySelector(".qtd-valor").textContent = "1";
      atualizarPrecoCard(box);
    }
  }, 1500);
}

function atualizarContadorPedidos() {
  const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
  const total = lista.reduce(function (acc, p) { return acc + Number(p.quantidade || 0); }, 0);

  const linkMenu = document.querySelector("#menu a[href='pedidos.html']");
  if (!linkMenu) return;

  let badge = linkMenu.querySelector(".badge-menu");
  if (!badge) {
    linkMenu.insertAdjacentHTML("beforeend", "<span class='badge-menu'>0</span>");
    badge = linkMenu.querySelector(".badge-menu");
  }

  badge.textContent = total;
  linkMenu.classList.add("menu-ativo");
}