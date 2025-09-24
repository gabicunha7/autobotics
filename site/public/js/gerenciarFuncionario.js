
function abrirPopUp(id) {
    popup = document.getElementById(id)

    popup.style.display = "flex";
}

function listar(dados) {
    const tabela = document.getElementById('func-table');

    console.log("TESTE");
    console.log(dados);

    // Exemplo: preencher a tabela
    tabela.innerHTML = `<tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Setor</th>
                        <th>Ativo</th>
                        <th>Ação</th>
                    </tr>`;

    dados.forEach(func => {
        tabela.innerHTML += `
            <tr>
                <td>${func.id_funcionario}</td>
                <td>${func.nome}</td>
                <td>${func.email}</td>
                <td>${func.fksetor}</td>
                <td>${func.ativo}</td>
                <td onclick="excluir(${func.id_funcionario})">X</td>
            </tr>
        `;
    });
}

function buscar() {
    fetch("/funcionario/buscar", {
        method: "GET"
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); // transforma a resposta em JSON
        } else {
            throw "Erro ao buscar funcionários.";
        }
    })
    .then(dados => {
        listar(dados); // chama listar já com os dados prontos
    })
    .catch(erro => {
        console.error(erro);
    });
}


function cadastrar() {
    fetch("/funcionario/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: ipt_nome.value.trim(),
            email: ipt_email.value.trim(),
            senha: ipt_senha.value,
            setor: ipt_setor.value
        })
    })
    .then(function (resposta) {
        console.log(resposta);
        
        if (resposta.ok) {
            popup = document.getElementById("cadastrar-func")

        popup.style.display = "none";
            buscar()            
        }
    })

}

function excluir(id) {
    fetch("/funcionario/excluir", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id:id
        })
    })
    .then(function (resposta) {
        console.log(resposta);
        
        if (resposta.ok) {
            buscar()
        }
    })
}

buscar()