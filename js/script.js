// Seletores
const linkQuadro = document.getElementById('link-quadro');
const linkCarrossel = document.getElementById('link-carrossel');
const quadroView = document.getElementById('quadro-view');
const carousel = document.getElementById('carousel');

// Função para mostrar o quadro (substitui o carrossel)
function showQuadro() {
    carousel.classList.add('hidden');      // esconde o carrossel
    quadroView.classList.add('active');    // mostra o quadro
    quadroView.setAttribute('aria-hidden', 'false');
}

// Função para voltar ao carrossel
function showCarousel() {
    quadroView.classList.remove('active');
    quadroView.setAttribute('aria-hidden', 'true');

    // espera um pouco para suavizar a transição antes de mostrar o carrossel
    setTimeout(() => {
        carousel.classList.remove('hidden');
    }, 250);
}

// Eventos dos botões da sidebar
if (linkQuadro) {
    linkQuadro.addEventListener('click', e => {
        e.preventDefault();
        showQuadro();
    });
}

if (linkCarrossel) {
    linkCarrossel.addEventListener('click', e => {
        e.preventDefault();
        showCarousel();
    });
}

// Permite fechar o quadro com ESC
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') showCarousel();
});

let indiceEdicao = null; // Guarda qual índice está sendo editado

document.addEventListener("DOMContentLoaded", carregar);

function salvar() {
    const nome = document.getElementById("nome").value;
    const ano = document.getElementById("ano").value;
    const dataFechamento = document.getElementById("dataFechamento").value;

    if (!nome || !ano || !dataFechamento) {
        alert("Preencha todos os campos!");
        return;
    }

    let lista = JSON.parse(localStorage.getItem("registros")) || [];

    // Se NÃO está editando → adiciona novo
    if (indiceEdicao === null) {
        lista.push({ nome, ano, dataFechamento });
    } else {
        // Atualiza registro existente
        lista[indiceEdicao] = { nome, ano, dataFechamento };
        indiceEdicao = null;
        document.getElementById("btnSalvar").innerText = "Salvar Registro";
    }

    localStorage.setItem("registros", JSON.stringify(lista));

    // Limpa campos
    document.getElementById("nome").value = "";
    document.getElementById("ano").value = "";
    document.getElementById("dataFechamento").value = "";

    carregar();
}

function carregar() {
    let lista = JSON.parse(localStorage.getItem("registros")) || [];
    const tbody = document.querySelector("#tabela tbody");

    tbody.innerHTML = "";

    lista.forEach((reg, index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${reg.nome}</td>
            <td>${reg.ano}</td>
            <td>${reg.dataFechamento}</td>
            <td>
                <button onclick="editar(${index})">Editar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function editar(index) {
    let lista = JSON.parse(localStorage.getItem("registros")) || [];
    const reg = lista[index];

    // Carrega os dados nos inputs
    document.getElementById("nome").value = reg.nome;
    document.getElementById("ano").value = reg.ano;
    document.getElementById("dataFechamento").value = reg.dataFechamento;

    indiceEdicao = index; // marca qual será editado

    // Muda o texto do botão para indicar edição
    document.getElementById("btnSalvar").innerText = "Atualizar Registro";
}

// --------------------------------------------
// GERAR 200 REGISTROS FICTÍCIOS MILITARES, LISTA
// --------------------------------------------

// 5 nomes fixos
const nomesBase = ["João", "Carlos", "Paulo", "Mateus", "Henrique"];

// sobrenomes variados
const sobrenomes = [
    "Silva","Souza","Pereira","Costa","Oliveira","Castro","Melo","Freitas",
    "Carvalho","Nunes","Martins","Almeida","Braga","Barros","Santos","Cavalcante",
    "Ribeiro","Farias","Azevedo","Furtado","Lima","Andrade","Cardoso","Dias"
];

// gerar CPF
function gerarCPF() {
    return Array(11).fill(0).map(() => Math.floor(Math.random()*10)).join('');
}

// gerar data de nascimento
function gerarData() {
    const ano = 1960 + Math.floor(Math.random()*50);
    const mes = 1 + Math.floor(Math.random()*12);
    const dia = 1 + Math.floor(Math.random()*28);
    return `${dia}/${mes}/${ano}`;
}

// gerar número de processo
function gerarProcesso() {
    return "PROC-" + Math.floor(Math.random() * 90000 + 10000);
}

// gerar status
function gerarStatus() {
    return Math.random() > 0.5 ? "ATIVO" : "INATIVO";
}

const registrosMilitares = [];

// cria 200 nomes combinando os 5 nomes + sobrenomes aleatórios
for (let i = 0; i < 200; i++) {
    const nome = nomesBase[i % 5] + " " + sobrenomes[Math.floor(Math.random()*sobrenomes.length)];

    registrosMilitares.push({
        nome,
        cpf: gerarCPF(),
        processamento: gerarProcesso(),
        nascimento: gerarData(),
        status: gerarStatus()
    });
}

// --------------------------------------------
// FUNÇÃO PARA MOSTRAR RESULTADOS (TABELA)
// --------------------------------------------

function carregarTabelaMilitar(lista) {
    const tbody = document.getElementById("tbody-militar");
    tbody.innerHTML = "";

    lista.forEach(reg => {
        tbody.innerHTML += `
            <tr>
                <td>${reg.nome}</td>
                <td>${reg.cpf}</td>
                <td>${reg.processamento}</td>
                <td>${reg.nascimento}</td>
                <td>${reg.status}</td>
            </tr>
        `;
    });
}

// tabela começa vazia
carregarTabelaMilitar([]);

// --------------------------------------------
// BUSCA AUTOMÁTICA
// --------------------------------------------

document.getElementById("pesquisa").addEventListener("input", function () {
    const texto = this.value.toLowerCase();

    const filtrado = registrosMilitares.filter(reg =>
        reg.nome.toLowerCase().includes(texto)
    );

    carregarTabelaMilitar(filtrado);
});
