// ================================
// SELETORES
// ================================
const linkRegistros = document.getElementById('link-registros');
const linkCadastro = document.getElementById('link-cadastro');
const linkCarrossel = document.getElementById('link-carrossel');

const abaRegistros = document.getElementById('aba-registros');
const abaCadastro = document.getElementById('aba-cadastro');
const carousel = document.getElementById('carousel');

// ================================
// FUNÇÃO PARA MOSTRAR ABA
// ================================
function mostrarAba(aba) {
    // esconde todas as abas
    [abaCadastro, abaRegistros].forEach(a => {
        a.classList.remove('active');
        a.setAttribute('aria-hidden', 'true');
    });

    // mostra a aba escolhida
    aba.classList.add('active');
    aba.setAttribute('aria-hidden', 'false');

    // esconde carrossel
    carousel.classList.add('hidden');
}

// ================================
// VOLTAR PARA CARROSSEL
// ================================
function mostrarCarrossel() {
    [abaCadastro, abaRegistros].forEach(a => {
        a.classList.remove('active');
        a.setAttribute('aria-hidden', 'true');
    });
    carousel.classList.remove('hidden');
}

// ================================
// EVENTOS DA SIDEBAR
// ================================
linkCadastro.addEventListener('click', e => {
    e.preventDefault();
    mostrarAba(abaCadastro);
});

linkRegistros.addEventListener('click', e => {
    e.preventDefault();
    mostrarAba(abaRegistros);
});

linkCarrossel.addEventListener('click', e => {
    e.preventDefault();
    mostrarCarrossel();
});

// Fechar abas com ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') mostrarCarrossel();
});

// ================================
// STORAGE - REGISTROS MILITARES
// ================================
function obterRegistros() {
    return JSON.parse(localStorage.getItem("registrosMilitares")) || [];
}

function salvarRegistros(lista) {
    localStorage.setItem("registrosMilitares", JSON.stringify(lista));
}

function adicionarRegistroMilitar(registro) {
    const lista = obterRegistros();
    lista.push(registro);
    salvarRegistros(lista);
    carregarTabelaMilitar(obterRegistros());
}

// ================================
// CARREGAR TABELA
// ================================
function carregarTabelaMilitar(lista) {
    const tbody = document.getElementById("tbody-militar");
    tbody.innerHTML = "";

    // Ordena a lista pela data de nascimento (mais antiga primeiro)
    lista.sort((a, b) => parseData(a.nascimento) - parseData(b.nascimento));

    lista.forEach(reg => {
        const nascimentoFormatado = formatarDataParaDDMMYYYY(reg.nascimento);
        tbody.innerHTML += `
            <tr>
                <td>${reg.nome}</td>
                <td>${reg.cpf}</td>
                <td>${nascimentoFormatado}</td>
                <td>${reg.status}</td>
            </tr>
        `;
    });
}

// ================================
// CONVERSÃO DE DATAS
// ================================

// Converte data do input (YYYY-MM-DD) para DD/MM/YYYY
function formatarDataParaDDMMYYYY(dataStr) {
    if (!dataStr) return "";
    if (dataStr.includes('-')) {
        const [ano, mes, dia] = dataStr.split('-');
        return `${dia}/${mes}/${ano}`;
    }
    if (dataStr.includes('/')) {
        return dataStr; // já está no formato correto
    }
    return dataStr; // caso estranho, retorna como está
}

// Converte DD/MM/YYYY ou YYYY-MM-DD para objeto Date para ordenação
function parseData(dataStr) {
    if (!dataStr) return new Date(0);
    if (dataStr.includes('/')) { // formato DD/MM/YYYY
        const [dia, mes, ano] = dataStr.split('/');
        return new Date(`${ano}-${mes}-${dia}`);
    } else { // formato YYYY-MM-DD
        return new Date(dataStr);
    }
}

// ================================
// BUSCA
// ================================
document.getElementById("pesquisa").addEventListener("input", function () {
    const texto = this.value.toLowerCase();
    const lista = obterRegistros();
    const filtrado = lista.filter(reg => reg.nome.toLowerCase().includes(texto));
    carregarTabelaMilitar(filtrado);
});

// ================================
// CADASTRO
// ================================
document.getElementById("btn-salvar").addEventListener("click", () => {
    const nome = document.getElementById("cad-nome").value.trim();
    const cpf = document.getElementById("cad-cpf").value.trim();
    const nascimento = document.getElementById("cad-nascimento").value; // vem no formato YYYY-MM-DD
    const status = document.getElementById("cad-status").value;

    if (!nome || !cpf || !nascimento || !status) {
        alert("Preencha todos os campos.");
        return;
    }

    const novoRegistro = { nome, cpf, nascimento, status };
    adicionarRegistroMilitar(novoRegistro);

    // limpa formulário
    document.getElementById("cad-nome").value = "";
    document.getElementById("cad-cpf").value = "";
    document.getElementById("cad-nascimento").value = "";
    document.getElementById("cad-status").value = "";

    alert("Cadastro salvo com sucesso!");
});

// ================================
// CARREGAMENTO INICIAL
// ================================
document.addEventListener("DOMContentLoaded", () => {
    const registrosExistentes = obterRegistros();

    // Se não houver registros, cria 1 de teste
    if (registrosExistentes.length === 0) {
        adicionarRegistroMilitar({
            nome: "João da Silva",
            cpf: "12345678900",
            nascimento: "10/10/1980", // aqui você pode deixar em DD/MM/YYYY para o teste, mas será exibido direto
            status: "ATIVO"
        });
    } else {
        carregarTabelaMilitar(registrosExistentes);
    }
});
