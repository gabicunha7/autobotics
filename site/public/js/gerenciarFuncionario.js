funcionarioId = null
function fecharPopUp(id) {
    popup = document.getElementById(id)
    popup.style.display = "none";
}

// Funciona para editar e cadastro
function abrirPopUpCadastro(id) {  
    popup = document.getElementById(id)
    popup.style.display = "flex";
}

function buscarCargos(){
        fetch("/funcionario/buscarCargos", {
        method: "GET"
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); // transforma a resposta em JSON
        } else {
            throw "Erro ao buscar cargos.";
        }
    })
    .then(dados => {
        
        select = document.getElementById("slc_cargo")
        dados.forEach(dado => {
            select.innerHTML+=`<option value='${dado.id_cargo}'>${dado.nome}</option>`
            slc_cargo_editar.innerHTML+=`<option value='${dado.id_cargo}'>${dado.nome}</option>`
        });
    })
    .catch(erro => {
        console.error(erro);
    });
}

function buscarSetor(){
      varEmpresa = sessionStorage.EMPRESA_USUARIO;

    fetch("/funcionario/buscarSetor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_empresa: varEmpresa
        })
    }).then(response => {
        if (response.ok) {
            return response.json(); // transforma a resposta em JSON
        } else {
            throw "Erro ao buscar setores.";
        }
    }).then(dados=> {

        dados.forEach(dado => {
            slc_setor.innerHTML+=`<option value='${dado.id_setor}'>${dado.nome}</option>`
            slc_setor_editar.innerHTML+=`<option value='${dado.id_setor}'>${dado.nome}</option>`
        });
    }) 
}

function abrirPopUpEditar(idPopUp, idFunc) {
    funcionarioId = idFunc
    popup = document.getElementById(idPopUp)
    popup.style.display = "flex";
}

function listar(dados) {
    const tabela = document.getElementById('func-table');


    tabela.innerHTML = `<tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Setor</th>
                        <th>Ativo</th>
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
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    
    fetch("/funcionario/buscar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_empresa_server: varEmpresa
        })
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
    cargo = slc_cargo.value;
    setor = slc_setor.value;

    if(cargo == 2){
        setor = null;
    }

    if(ipt_nome.value == ""){
        erros("preencha o campo de nome")
    } else if (ipt_email.value == ""){
        erros("preencha o campo de email")
    } else if (ipt_senha.value == ""){
        erros("preencha o campo de senha")
    } else {
        fetch("/funcionario/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome: ipt_nome.value.trim(),
                    email: ipt_email.value.trim(),
                    senha: ipt_senha.value.trim(),
                    setor: setor,
                    cargo: cargo,
                    empresa: varEmpresa
                })
            })
            .then(function (resposta) {
                console.log(resposta);
                
                if (resposta.ok) {
                    popup = document.getElementById("cadastrar-func")

                    popup.style.display = "none";
                    buscar()            
                } else {
                    erros("Inserir um email válido, este já está sendo usado");
                }
    })
    }
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


function erros(texto){
    var divErrosLogin = document.getElementById("div_erros_login");
    if (texto) {
        divErrosLogin.style.display = "flex";
        divErrosLogin.innerHTML = texto;

        setTimeout(() => {
            divErrosLogin.style.display = 'none';
        }, 4000);
    }
}


buscar()
buscarCargos()
buscarSetor()