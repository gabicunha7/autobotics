funcionarioId = null
setorId = null

function fecharPopUp(id) {
    popup = document.getElementById(id)
    popup.style.display = "none";
}

// Funciona para editar e cadastro
function abrirPopUpCadastro(id) { 
    popup = document.getElementById(id)
    popup.style.display = "flex";
}

function excluir(id) {
    fetch("/controladores/excluir", {
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
            buscarControlador()
        }
    })
}

function listar(dados) {
    const tabela = document.getElementById('controlador-table');


    tabela.innerHTML = `<tr>
                        <th>Número Serial</th>
                        <th>Setor</th>
                        <th>Status</th>
                        <th>Excluir</th>
                        <th>Editar</th>
                    </tr>`;

    dados.forEach(controlador => {
        tabela.innerHTML += `
            <tr>
                <td>${controlador.numero_serial}</td>
                <td>${controlador.nome}</td>
                <td>${controlador.status}</td>
                <td onclick="excluir(${controlador.id_controlador})"><img src="assets/icones/lixeira_icon.png"></td>
                <td onclick="abrirPopUpEditar('editar-func', ${controlador.id_controlador})"><img src="assets/icones/editar_icon.png"></td>
            </tr>
        `;
    });
}
function abrirPopUpEditar(idPopUp, idControlador) {
    controladorId = idControlador
    popup = document.getElementById(idPopUp)
    popup.style.display = "flex";
}

function buscarControlador() {
    document.getElementById("nome-usuario").innerHTML = sessionStorage.NOME_USUARIO;
    document.getElementById("email-usuario").innerHTML = sessionStorage.EMAIL_USUARIO;
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    setorId = slc_setor_parametro.value;
    
    fetch("/controladores/buscarControlador", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_empresa_server: varEmpresa,

        })
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); 
        } else {
            throw "Erro ao buscar controladores.";
        }
    })
    .then(dados => {
        listar(dados); 
    })
    .catch(erro => {
        console.error(erro);
    });
}


function cadastrar() {
    setorId = slc_setor_parametro.value;
    varEmpresa = sessionStorage.EMPRESA_USUARIO;

    if(ipt_numSerial.value == ""){
        erros("preencha o campo de número serial")
    } else if (setorId == ""){
        erros("preencha o campo de setor")
    } else {
        fetch("/controladores/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    numero_serial: ipt_numSerial.value.trim(),
                    idsetor: setorId,
                    idEmpresa: varEmpresa
                })
            })
            .then(function (resposta) {
                console.log(resposta);
                
                if (resposta.ok) {
                    popup = document.getElementById("cadastrar-func")

                    popup.style.display = "none";
                    buscarControlador()    
                    fecharPopUp()
                           
                } else {
                    erros("Inserir um Número serial válido, este já está sendo usado");
                }
    })
    }
}

function editar() {
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    setorId = slc_setor_parametro_editar.value;

    if(ipt_numSerial_editar.value == ""){
        erros("preencha o campo de número serial")
    } else if (setorId == ""){
        erros("preencha o campo de setor")
    } else{
        fetch("/controladores/editar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id:controladorId,
                numero_serial: ipt_numSerial_editar.value.trim(),
                setor: setorId,
                empresa: varEmpresa
            
            })
        })
        .then(function (resposta) {
            console.log(resposta);
            
            if (resposta.ok) {
                popup = document.getElementById("editar-func")
                popup.style.display = "none";
                buscarControlador()    
                fecharPopUp()    
            } else {
                erros("Inserir um Número serial válido, este já está sendo usado");
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

function buscarSetorParametro(){
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    fetch("/parametros/buscarSetorParametro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_empresa: varEmpresa
        })
    }).then(resposta => {
        if (resposta.ok) {
            return resposta.json(); // transforma a resposta em JSON
        } else {
            throw "Erro ao buscar setor.";
        }
    }).then(dados=> {
        console.log(dados)
        dados.forEach(dados => {
            slc_setor_parametro.innerHTML+=`<option value='${dados.id_setor}'>${dados.nome}</option>`
            slc_setor_parametro_editar.innerHTML+=`<option value='${dados.id_setor}'>${dados.nome}</option>`

        });
    })
    
}




buscarSetorParametro()
buscarControlador()