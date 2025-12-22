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
    const status = document.getElementById('cad-status').value;

    if (!nome || !cpf || !nascimento || !status) {
        alert('Preencha todos os campos.');
        return;
    }

    const registros = obterRegistros();

    if (indiceEditando !== null) {
        // Atualizar registro existente
        registros[indiceEditando] = { nome, cpf, nascimento, status };
        salvarRegistros(registros);
        indiceEditando = null;
        btnSalvar.innerText = 'Salvar Cadastro';
    } else {
        // Novo registro
        adicionarRegistro({ nome, cpf, nascimento, status });
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

// ================================
// INICIALIZAÇÃO
// ================================
const registrosIniciais = [
    { nome: 'Aline Souza', cpf: '58746941203', nascimento: '1965-09-04', status: 'INATIVO' },
    { nome: 'Carlos Almeida', cpf: '11122233344', nascimento: '1968-02-15', status: 'INATIVO' },
    { nome: 'Fagner Pinheiro', cpf: '54789632104', nascimento: '1975-06-22', status: 'INATIVO' },
    { nome: 'Rodolfo Mendes', cpf: '56987423514', nascimento: '1977-09-08', status: 'INATIVO' },
    { nome: 'Gabriele Figueiredo', cpf: '58741369820', nascimento: '1978-09-06', status: 'INATIVO' },
    { nome: 'João da Silva', cpf: '12345678900', nascimento: '1980-10-10', status: 'ATIVO' },
    { nome: 'Marcos Teixeira', cpf: '22233344455', nascimento: '1982-04-18', status: 'ATIVO' },
    { nome: 'Samuel Gomes', cpf: '78569412301', nascimento: '1985-07-15', status: 'ATIVO' },
    { nome: 'Lucas Mendes', cpf: '85475632141', nascimento: '1987-03-05', status: 'INATIVO' },
    { nome: 'Rafael Neves', cpf: '10856947102', nascimento: '1988-06-08', status: 'ATIVO' },
    { nome: 'Hugo Castro', cpf: '78569841208', nascimento: '1988-12-30', status: 'ATIVO' },
    { nome: 'Daniel Rocha', cpf: '33344455566', nascimento: '1990-01-12', status: 'ATIVO' },
    { nome: 'Fernanda Lima', cpf: '44455566677', nascimento: '1991-05-27', status: 'ATIVO' },
    { nome: 'Bruno Pacheco', cpf: '55566677788', nascimento: '1993-08-19', status: 'INATIVO' },
    { nome: 'Patrícia Nunes', cpf: '66677788899', nascimento: '1994-11-02', status: 'ATIVO' },
    { nome: 'Eduardo Rangel', cpf: '77788899900', nascimento: '1996-09-14', status: 'ATIVO' },
    { nome: 'Camila Torres', cpf: '88899900011', nascimento: '1997-03-22', status: 'INATIVO' },
    { nome: 'Felipe Araujo', cpf: '99900011122', nascimento: '1998-06-01', status: 'ATIVO' },
    { nome: 'Renata Guedes', cpf: '10111213141', nascimento: '1999-12-09', status: 'ATIVO' },
    { nome: 'Luana Lopes', cpf: '87447569845', nascimento: '2001-07-09', status: 'ATIVO' }
];

document.addEventListener('DOMContentLoaded', () => {
    const registros = obterRegistros();

    if (registros.length === 0) {
        salvarRegistros(registrosIniciais);
        carregarTabela(registrosIniciais);
    } else {
        carregarTabela(registros);
    }
});
