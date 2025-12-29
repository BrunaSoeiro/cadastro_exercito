
function obterRegistros() {
    return registrosFixos;
}

function salvarRegistros(lista) {
    registrosFixos = lista;
}


function carregarEstados() {
    fetch('https://brasilapi.com.br/api/ibge/uf/v1')
        .then(resposta => resposta.json())
        .then(estados => {
            const selectEstado = document.getElementById('cad-estado');
            selectEstado.innerHTML = '<option value="">Selecione o estado</option>';

            estados.forEach(uf => {
                const option = document.createElement('option');
                option.value = uf.sigla;
                option.textContent = `${uf.sigla} - ${uf.nome}`;
                selectEstado.appendChild(option);
            });
        })
        .catch(() => {
            alert('Erro ao carregar estados.');
        });
}


// ====

// ================================
// SELETORES
// ================================
const linkRegistros = document.getElementById('link-registros');
const linkCadastro = document.getElementById('link-cadastro');
const linkCarrossel = document.getElementById('link-carrossel');
const linkGraficos = document.getElementById('link-graficos');

const abaRegistros = document.getElementById('aba-registros');
const abaCadastro = document.getElementById('aba-cadastro');
const viewGraficos = document.getElementById('view-graficos');
const carousel = document.getElementById('carousel');

const btnSalvar = document.getElementById('btn-salvar');

// ================================
// CONTROLE DE TELAS
// ================================
function esconderTudo() {
    abaCadastro.classList.remove('active');
    abaCadastro.setAttribute('aria-hidden', 'true');

    abaRegistros.classList.remove('active');
    abaRegistros.setAttribute('aria-hidden', 'true');

    viewGraficos.classList.remove('active');

    carousel.classList.add('hidden');
}

function mostrarCarrossel() {
    esconderTudo();
    carousel.classList.remove('hidden');
}

// ================================
// EVENTOS SIDEBAR
// ================================
linkCadastro.addEventListener('click', e => {
    e.preventDefault();
    esconderTudo();
    abaCadastro.classList.add('active');
    abaCadastro.setAttribute('aria-hidden', 'false');
});

linkRegistros.addEventListener('click', e => {
    e.preventDefault();
    esconderTudo();
    abaRegistros.classList.add('active');
    abaRegistros.setAttribute('aria-hidden', 'false');
});

linkGraficos.addEventListener('click', e => {
    e.preventDefault();
    esconderTudo();
    viewGraficos.classList.add('active');
    atualizarGraficos();
});

linkCarrossel.addEventListener('click', e => {
    e.preventDefault();
    mostrarCarrossel();
});

// ESC volta ao carrossel
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') mostrarCarrossel();
});

// ================================
// STORAGE
// ================================
function obterRegistros() {
    return JSON.parse(localStorage.getItem('registrosMilitares')) || [];
}

function salvarRegistros(lista) {
    localStorage.setItem('registrosMilitares', JSON.stringify(lista));
}

function adicionarRegistro(registro) {
    const lista = obterRegistros();
    lista.push(registro);
    salvarRegistros(lista);
    carregarTabela(lista);
}

// ================================
// TABELA
// ================================
function carregarTabela(lista) {
    const tbody = document.getElementById('tbody-militar');
    tbody.innerHTML = '';

    lista.sort((a, b) => parseData(a.nascimento) - parseData(b.nascimento));

    lista.forEach((r, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${r.nome}</td>
                <td>${r.cpf}</td>
                <td>${formatarData(r.nascimento)}</td>
                <td>${r.estado}</td>
                <td>${r.status}</td>
                <td>
                    <button class="btn-editar" data-index="${index}">Editar</button>
                </td>
            </tr>
        `;
    });

    // Adicionar evento nos botões Editar
    document.querySelectorAll('.btn-editar').forEach(btn => {
        btn.addEventListener('click', e => {
            const idx = e.target.getAttribute('data-index');
            carregarFormularioParaEdicao(idx);
        });
    });

    atualizarGraficos(); // 🔥 SEMPRE sincroniza
}

// ================================
// FUNÇÃO EDITAR - RAFAEL
// ================================
let indiceEditando = null;

function carregarFormularioParaEdicao(index) {
    const registros = obterRegistros();
    const registro = registros[index];

    document.getElementById('cad-nome').value = registro.nome;
    document.getElementById('cad-cpf').value = registro.cpf;
    document.getElementById('cad-nascimento').value = registro.nascimento;
    document.getElementById('cad-estado').value = registro.estado;
    document.getElementById('cad-status').value = registro.status;

    indiceEditando = index;
    btnSalvar.innerText = 'Atualizar Registro';

    esconderTudo();
    abaCadastro.classList.add('active');
    abaCadastro.setAttribute('aria-hidden', 'false');
}

// ================================
// DATAS
// ================================
function formatarData(data) {
    if (data.includes('-')) {
        const [a, m, d] = data.split('-');
        return `${d}/${m}/${a}`;
    }
    return data;
}

function parseData(data) {
    if (data.includes('/')) {
        const [d, m, a] = data.split('/');
        return new Date(`${a}-${m}-${d}`);
    }
    return new Date(data);
}

// ================================
// BUSCA
// ================================
document.getElementById('pesquisa').addEventListener('input', function () {
    const texto = this.value.toLowerCase();
    const filtrado = obterRegistros().filter(r =>
        r.nome.toLowerCase().includes(texto)
    );
    carregarTabela(filtrado);
});

// ================================
// CADASTRO
// ================================
btnSalvar.addEventListener('click', () => {
    const nome = document.getElementById('cad-nome').value.trim();
    const cpf = document.getElementById('cad-cpf').value.trim();
    const nascimento = document.getElementById('cad-nascimento').value;
    const estado = document.getElementById('cad-estado').value;
    const status = document.getElementById('cad-status').value;

if (!nome || !cpf || !nascimento || !status || !estado) {
    alert('Preencha todos os campos.');
    return;
}


    const registros = obterRegistros();

    if (indiceEditando !== null) {
        // Atualizar registro existente
        registros[indiceEditando] = { nome, cpf, nascimento, status, estado };
        salvarRegistros(registros);
        indiceEditando = null;
        btnSalvar.innerText = 'Salvar Cadastro';
    } else {
        // Novo registro
        adicionarRegistro({ nome, cpf, nascimento, status, estado });
    }

    // Limpar formulário
    document.getElementById('cad-nome').value = '';
    document.getElementById('cad-cpf').value = '';
    document.getElementById('cad-nascimento').value = '';
    document.getElementById('cad-status').value = '';

    carregarTabela(obterRegistros());

    const popup = document.getElementById('popup-sucesso');
    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
});

// ================================
// POPUP
// ================================
const popup = document.getElementById('popup-sucesso');
const btnOk = document.getElementById('popup-ok');

btnOk.addEventListener('click', () => {
    popup.classList.remove('active');
    popup.setAttribute('aria-hidden', 'true');
});

// ================================
// GRÁFICOS DINÂMICOS
// ================================
function atualizarGraficos() {
    const lista = obterRegistros();
    const total = lista.length;

    const ativos = lista.filter(r => r.status === 'ATIVO').length;
    const inativos = lista.filter(r => r.status === 'INATIVO').length;

    const pAtivo = total ? Math.round((ativos / total) * 100) : 0;
    const pInativo = total ? Math.round((inativos / total) * 100) : 0;

    document.querySelector('.barra.ativo').style.width = pAtivo + '%';
    document.querySelector('.barra.inativo').style.width = pInativo + '%';

    document.querySelector('.barra.ativo').innerText = `Ativos ${pAtivo}%`;
    document.querySelector('.barra.inativo').innerText = `Inativos ${pInativo}%`;

    document.querySelector('.pizza').style.background =
        `conic-gradient(#2e7d32 0% ${pAtivo}%, #c62828 ${pAtivo}% 100%)`;
}


document.addEventListener('DOMContentLoaded', () => {
    carregarEstados();
    carregarTabela(obterRegistros());
});


