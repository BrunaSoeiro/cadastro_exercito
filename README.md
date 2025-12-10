Boa noite, segue abaixo o código html e js como referencia para tabela/input/output de dados: (versão teste)



"<div class="container">

    <label>Nome:</label>
    <input type="text" id="nome">

    <label>Ano de Óbito:</label>
    <input type="number" id="ano">

    <label>Data de Fechamento do Processo:</label>
    <input type="date" id="dataFechamento">

    <button onclick="salvar()">Salvar Registro</button>

    <table id="tabela">
        <thead>
            <tr>
                <th>Nome</th>
                <th>Ano de Óbito</th>
                <th>Data do Fechamento</th>
            </tr>
        </thead>
        <tbody></tbody>
    </table>

</div>

<script>
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
            // Se está editando → atualiza registro existente
            lista[indiceEdicao] = { nome, ano, dataFechamento };
            indiceEdicao = null;
            document.querySelector("button").innerText = "Salvar Registro";
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
        document.querySelector("button").innerText = "Atualizar Registro";
    }
</script>"
