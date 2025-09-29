funcionarioId = null
function fecharPopUp(id) {
    popup = document.getElementById(id)
    popup.style.display = "none";
}
// Funciona para editar e cadastro
function abrirPopUpCadastro(id) {
    fetch("/funcionario/buscarCargos", {
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
        console.log(dados);
        
        select = document.getElementById("slc_cargo")
        dados.forEach(dado => {
            select.innerHTML+=`<option value='${dado.id_cargo}'>${dado.nome}</option>`
        });
    })
    .catch(erro => {
        console.error(erro);
    });
    popup = document.getElementById(id)
    popup.style.display = "flex";
}

function abrirPopUpEditar(idPopUp, idFunc) {
    fetch("/funcionario/buscarCargos", {
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
        console.log(dados);
        
        select = document.getElementById("slc_cargo_editar")
        dados.forEach(dado => {
            select.innerHTML+=`<option value='${dado.id_cargo}'>${dado.nome}</option>`
        });
    })
    .catch(erro => {
        console.error(erro);
    });
    funcionarioId = idFunc
    popup = document.getElementById(idPopUp)
    popup.style.display = "flex";
}

function listar(dados) {
    const tabela = document.getElementById('func-table');

    console.log("TESTE");
    console.log(dados);

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
                <td>${func.fk_setor}</td>
                <td>${func.ativo}</td>
                <td onclick="excluir(${func.id_funcionario})">X</td>
                <td onclick="abrirPopUpEditar('editar-func', ${func.id_funcionario})">E</td>
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
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    alert(varEmpresa);

    fetch("/funcionario/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: ipt_nome.value.trim(),
            email: ipt_email.value.trim(),
            senha: ipt_senha.value,
            setor: ipt_setor.value,
            cargo: slc_cargo.value,
            empresa: varEmpresa
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

function editar() {
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    fetch("/funcionario/editar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id:funcionarioId,
            nome: ipt_nome_editar.value.trim(),
            email: ipt_email_editar.value.trim(),
            senha: ipt_senha_editar.value,
            setor: ipt_setor_editar.value,
            cargo: slc_cargo_editar.value,
            empresa: varEmpresa
        })
    })
    .then(function (resposta) {
        console.log(resposta);
        
        if (resposta.ok) {
            buscar()
            popup = document.getElementById("editar-func")

            popup.style.display = "none";
            buscar()      
        }
    })
}

buscar()