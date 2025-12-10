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