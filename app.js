const fs = require('fs');
const path = require('path');

// Configuração de caminhos
const PASTA_DADOS = path.join(__dirname, 'dados');
const CAMINHO_ARQUIVO = path.join(PASTA_DADOS, 'produtos.json');

// --- INICIALIZAÇÃO ---
if (!fs.existsSync(PASTA_DADOS)) {
    fs.mkdirSync(PASTA_DADOS);
}

if (!fs.existsSync(CAMINHO_ARQUIVO)) {
    const produtosIniciais = [
        { "id": 1, "nome": "Notebook", "preco": 2500, "estoque": 10 },
        { "id": 2, "nome": "Mouse", "preco": 50, "estoque": 50 },
        { "id": 3, "nome": "Teclado", "preco": 120, "estoque": 30 }
    ];
    fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(produtosIniciais, null, 2));
}

// --- FUNÇÕES DE APOIO (Melhoradas com tratamento de erro) ---
function lerArquivo() {
    try {
        const conteudo = fs.readFileSync(CAMINHO_ARQUIVO, 'utf-8');
        return JSON.parse(conteudo);
    } catch (error) {
        console.error("❌ Erro ao ler ou parsear o JSON. Iniciando array vazio.");
        return []; // Retorna um array vazio se o JSON estiver quebrado
    }
}

function salvarArquivo(dados) {
    fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(dados, null, 2));
}

// --- FUNCIONALIDADES SOLICITADAS ---

// 1. Listar Produtos
function listarProdutos() {
    const produtos = lerArquivo();
    console.log('\n=== ESTOQUE ATUAL ===');
    console.table(produtos);
    
    // CORREÇÃO: Usar Number() ou garantir que preco/estoque sejam números no JSON
    const valorTotal = produtos.reduce((acc, p) => acc + (Number(p.preco) * Number(p.estoque)), 0);
    console.log(`💰 Valor Total do Patrimônio: R$ ${valorTotal.toFixed(2)}`);
}

// 2. Adicionar Produto
function adicionarProduto(nome, preco, estoque) {
    const produtos = lerArquivo();
    // Garante que o ID seja um número
    const novoId = produtos.length > 0 ? Math.max(...produtos.map(p => Number(p.id))) + 1 : 1;
    const novo = { id: novoId, nome, preco: Number(preco), estoque: Number(estoque) };
    
    produtos.push(novo);
    salvarArquivo(produtos);
    console.log(`\n✅ SUCESSO: Produto "${nome}" adicionado com ID ${novoId}.`);
}

// 3. Buscar Produto
function buscarProduto(id) {
    const produtos = lerArquivo();
    const encontrado = produtos.find(p => p.id === id);
    console.log(`\n🔍 BUSCANDO ID ${id}...`);
    if (encontrado) {
        console.table([encontrado]); // console.table fica melhor
    } else {
        console.log("❌ ERRO: Produto não localizado.");
    }
}

// 4. Atualizar Estoque
function atualizarEstoque(id, novaQtd) {
    const produtos = lerArquivo();
    const index = produtos.findIndex(p => p.id === id);
    
    if (index !== -1) {
        const antigo = produtos[index].estoque;
        produtos[index].estoque = Number(novaQtd);
        salvarArquivo(produtos);
        console.log(`\n🔄 ESTOQUE ATUALIZADO (ID ${id}): De ${antigo} para ${novaQtd}.`);
    } else {
        console.log(`\n❌ ERRO: Impossível atualizar. ID ${id} não existe.`);
    }
}

// 5. Remover Produto
function removerProduto(id) {
    let produtos = lerArquivo();
    const originalLength = produtos.length;
    produtos = produtos.filter(p => p.id !== id);
    
    if (produtos.length < originalLength) {
        salvarArquivo(produtos);
        console.log(`\n🗑️ REMOVIDO: O produto ID ${id} saiu do sistema.`);
    } else {
        console.log(`\n❌ ERRO: ID ${id} não encontrado para remoção.`);
    }
}

// 6. Produtos em Falta
function produtosEmFalta(limite) {
    const produtos = lerArquivo();
    const listaFalta = produtos.filter(p => p.estoque < limite);
    
    console.log(`\n⚠️ ALERTA DE REPOSIÇÃO (Limite: ${limite})`);
    if (listaFalta.length > 0) {
        console.table(listaFalta);
        console.log("📢 AÇÃO RECOMENDADA: Realizar novo pedido para estes itens.");
    } else {
        console.log("✅ Tudo ok! Nenhum produto abaixo do limite.");
    }
}

// --- ÁREA DE TESTES ---
// (Descomente para testar)
listarProdutos();
adicionarProduto("Headset Gamer", 200, 15);
atualizarEstoque(2, 5); // Mouse baixa estoque
produtosEmFalta(10);
removerProduto(1); // Remove Notebook
listarProdutos(); // Ver final
