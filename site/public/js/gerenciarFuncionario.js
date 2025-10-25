funcionarioId = null

function fecharPopUp(id) {
    popup = document.getElementById(id)
    if (popup) popup.style.display = "none";
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
}

function abrirPopUpCadastro(id) {
    popup = document.getElementById(id)
    if (popup) popup.style.display = "flex";
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.add('active');
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
    if (popup) popup.style.display = "flex";
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.add('active');
}

function fecharTodosPopups(){
    const ids = ['cadastrar-parametro', 'editar-par', 'cadastrar-func', 'editar-func', 'cadastrar-setor', 'editar-setor'];
    ids.forEach(id => {
        const p = document.getElementById(id);
        if (p) p.style.display = 'none';
    });
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
}

const overlay_element = document.getElementById('overlay');
if (overlay_element) overlay_element.addEventListener('click', fecharTodosPopups);

function listar(dados) {
    const tabela = document.getElementById('func-table');


    tabela.innerHTML = `<tr class= "teste">
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Setor</th>
                        <th>Cargo</th>
                        <th>Excluir</th>
                        <th>Editar</th>
                    </tr>`;

    dados.forEach(func => {
        tabela.innerHTML += `
            <tr class="teste2">
                <td>${func.nome}</td>
                <td>${func.email}</td>
                <td>${func.nome_setor != null ? func.nome_setor : "Nenhum setor"}</td>
                <td>${func.nome_cargo == "Eng_Robotica" ? "Engenheiro de robótica" : "Engenheiro de manutenção"}</td>
                <td onclick="excluir(${func.id_funcionario})"><img src="assets/icones/lixeira_icon.png"></td>
                <td onclick="abrirPopUpEditar('editar-func', ${func.id_funcionario})"><img src="assets/icones/editar_icon.png"></td>
            </tr>
        `;
    });
}

function buscar() {
document.getElementById("nome-usuario").innerHTML = sessionStorage.NOME_USUARIO;
document.getElementById("email-usuario").innerHTML = sessionStorage.EMAIL_USUARIO;

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
                    fecharPopUp('cadastrar-func')            
                } else {
                    erros("Inserir um email válido, este já está sendo usado");
                }
    })
    }
}

function excluir(id) {
    if(id == sessionStorage.ID_FUNCIONARIO){
        sessionStorage.clear();
        window.location = "index.html";
    }

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
    cargo = slc_cargo_editar.value;
    setor = slc_setor_editar.value;

    if(cargo == 2){
        setor = null;
    }

    if(ipt_nome_editar.value == ""){
        erros("preencha o campo de nome")
    } else if (ipt_email_editar.value == ""){
        erros("preencha o campo de email")
    } else if (ipt_senha_editar.value == ""){
        erros("preencha o campo de senha")
    } else{
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
                setor: setor,
                cargo: cargo,
                empresa: varEmpresa
            })
        })
        .then(function (resposta) {
            console.log(resposta);
            
            if (resposta.ok) {
                    if(funcionarioId == sessionStorage.ID_FUNCIONARIO){
                        sessionStorage.NOME_USUARIO = ipt_nome_editar.value;
                        sessionStorage.EMAIL_USUARIO = ipt_email_editar.value;
                        document.getElementById("nome-usuario").innerHTML = sessionStorage.NOME_USUARIO;
                        document.getElementById("email-usuario").innerHTML = sessionStorage.EMAIL_USUARIO;
                    }
                
                popup = document.getElementById("editar-func")
                popup.style.display = "none";
                buscar()
                fecharPopUp('editar-func')      
            } else {
                erros("Inserir um email válido, este já está sendo usado");
            }
        })
    }
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