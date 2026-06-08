const BASE_URL = "http://localhost:3000"

// 1. BUSCAR PRODUTOS

async function buscarProdutos(){

// Realizar conexão (Espera até receber resposta)

    const response = await fetch (`${BASE_URL}/produtos`)

// Armazenar os DADOS (Espera até receber os dados)
    const dados = await response.json()

    if(!response.ok) throw new Error(dados.erro || `Erro ${response.status}`)
    return dados.dados
}


// 2. CRIAR PEDIDO

async function criarPedido(cliente, itens) {

//Solicita comunicação e executa o metodo post (publica o cliente e os itens do pedido)
    const response = await fetch (`${BASE_URL}/pedidos`,{
        method: "POST",
        headers:{ "Content-Type" : "application/json" },
        body: JSON.stringify({cliente, itens}),

    })
    const dados = await response.json()

    if(!response.ok) throw new Error (dados.erro || `Erro ${response.status}`)
    return dados
}


// 3. BUSCAR PEDIDOS - (FOCO PRA COZINJA TER ACESSO AOS PEDIDOS)

async function buscarPedidos(){
    const response = await fetch (`${BASE_URL}/pedidos`)
    const dados = await response.json()

    if(!response.ok) throw new Error(dados.erro || `Erro ${response.status}`)
        
        return dados
}

// 4. DELETAR OS PEDIDOS

async function deletarPedido(id){
    const response = await fetch (`${BASE_URL}/pedidos/${id}`, {
        method: "DELETE",

    })
    const dados = await response.json()
    if(!response.ok) throw new Error(dados.erro || `Erro ${response.status}`)
    
        return dados
}

// 5. ATUALIZAR STATUS DO PEDIDO

async function atualizarStatusPedido(id, novoStatus) {
    const response = await fetch (`${BASE_URL}/pedidos/${id}/status`, {
        method: "PATCH",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({status: novoStatus}),
})
    const dados = await response.json()

    if(!response.ok)throw new Error(dados.erro || `Erro ${response.status}`)
    
        return dados
}