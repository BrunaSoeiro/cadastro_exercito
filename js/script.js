let registrosFixos = [
    { nome: "João da Silva", cpf: "529.982.247-25", nascimento: "1990-05-12", status: "ATIVO" },
    { nome: "Carlos Pereira", cpf: "168.995.350-09", nascimento: "1988-03-20", status: "INATIVO" },
    { nome: "Rafael Santos", cpf: "987.654.321-00", nascimento: "1995-07-10", status: "ATIVO" },
    { nome: "Lucas Oliveira", cpf: "746.971.314-01", nascimento: "1992-11-02", status: "ATIVO" },
    { nome: "Marcos Lima", cpf: "295.379.148-93", nascimento: "1985-01-18", status: "INATIVO" },
    { nome: "Pedro Almeida", cpf: "073.132.906-06", nascimento: "1998-06-30", status: "ATIVO" },
    { nome: "Thiago Costa", cpf: "514.470.857-36", nascimento: "1993-09-14", status: "INATIVO" },
    { nome: "Felipe Rocha", cpf: "153.509.460-56", nascimento: "1989-12-25", status: "ATIVO" },
    { nome: "Bruno Martins", cpf: "286.255.878-87", nascimento: "1996-04-08", status: "ATIVO" },
    { nome: "André Teixeira", cpf: "362.871.580-04", nascimento: "1987-08-21", status: "INATIVO" },

    { nome: "Daniel Farias", cpf: "704.602.160-23", nascimento: "1991-02-17", status: "ATIVO" },
    { nome: "Gustavo Nogueira", cpf: "417.821.950-05", nascimento: "1994-10-09", status: "INATIVO" },
    { nome: "Eduardo Pacheco", cpf: "830.168.320-09", nascimento: "1986-07-01", status: "ATIVO" },
    { nome: "Victor Barros", cpf: "071.932.300-03", nascimento: "1999-05-05", status: "ATIVO" },
    { nome: "Leonardo Azevedo", cpf: "246.592.710-08", nascimento: "1990-03-03", status: "INATIVO" },
    { nome: "Henrique Guedes", cpf: "936.203.460-02", nascimento: "1997-06-16", status: "ATIVO" },
    { nome: "Matheus Rangel", cpf: "125.418.320-30", nascimento: "1992-09-27", status: "INATIVO" },
    { nome: "Igor Freitas", cpf: "398.475.610-08", nascimento: "1984-12-11", status: "ATIVO" },
    { nome: "Diego Rezende", cpf: "681.400.970-05", nascimento: "1995-01-29", status: "INATIVO" },
    { nome: "Alexandre Mota", cpf: "502.978.610-06", nascimento: "1983-04-19", status: "ATIVO" },

    { nome: "Paulo Ribeiro", cpf: "746.824.890-06", nascimento: "1996-07-07", status: "ATIVO" },
    { nome: "Rodrigo Batista", cpf: "089.293.240-90", nascimento: "1989-10-23", status: "INATIVO" },
    { nome: "Fernando Cunha", cpf: "431.968.750-00", nascimento: "1991-08-13", status: "ATIVO" }
];



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


document.addEventListener('DOMContentLoaded', () => {
    carregarEstados();
    carregarTabela(obterRegistros());
});


