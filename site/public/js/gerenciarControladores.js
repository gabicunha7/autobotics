funcionarioId = null
function fecharPopUp(id) {
    popup = document.getElementById(id)
    popup.style.display = "none";
}

// Funciona para editar e cadastro
function abrirPopUpCadastro(id) {
    
    varEmpresa = sessionStorage.EMPRESA_USUARIO;

    fetch("/controlador/buscarSetor", {
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
        });
    }) 
    popup = document.getElementById(id)
    popup.style.display = "flex";
}
 /*
function abrirPopUpEditar(idPopUp, idFunc) {
    fetch("/controlador/buscarCargos", {
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
*/
function listar(dados) {
    const tabela = document.getElementById('func-table');


    tabela.innerHTML = `<tr>
                        <th>ID</th>
                        <th>Número Serial</th>
                        <th>Status</th>
                    </tr>`;

    dados.forEach(func => {
        tabela.innerHTML += `
            <tr>
                <td>${func.id_controlador}</td>
                <td>${func.numSerial}</td>
                <td>${func.status}</td>
                <td onclick="excluir(${func.id_controlador})">X</td>
                <td onclick="abrirPopUpEditar('editar-control', ${func.id_controlador})">E</td>
            </tr>
        `;
    });
}

function buscar() {
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    
    fetch("/controlador/buscar", {
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

    if(ipt_numero_serial.value == ""){
        erros("preencha o campo de nome")
   // } else if (ipt_status.value == ""){
    //    erros("preencha o campo de status")
    } else {
        fetch("/controlador/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    numero_serial: ipt_numSerial.value.trim(),
                    status: ipt_status.value.trim(),

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
}

function excluir(id) {
    fetch("/controlador/excluir", {
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
    fetch("/controlador/editar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id:controladorId,
            numero_serial: ipt_numSerial.value.trim(),
            status: ipt_status.value.trim(),
         
        })
    })
    .then(function (resposta) {
        console.log(resposta);
        
        if (resposta.ok) {
            buscar()
            popup = document.getElementById("editar-control")

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