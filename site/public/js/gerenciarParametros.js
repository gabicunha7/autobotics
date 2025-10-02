parametroId = null;

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
            throw "Erro ao buscar funcionários.";
        }
    }).then(dados=> {
        console.log(dados)
        dados.forEach(dados => {
            slc_setor_parametro.innerHTML+=`<option value='${dados.id_setor}'>${dados.nome}</option>`
        });
    })
    
}

function buscarComponenteParametro(){
    var selectComponente = document.getElementById('slc_componente_parametro'); 
    selectComponente.style.display = 'block';
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    fetch("/parametros/buscarComponenteParametro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({  
            id_setor: slc_setor_parametro.value,
            id_empresa: varEmpresa
        })
    }).then(resposta => {
        if (resposta.ok) {
            return resposta.json(); // transforma a resposta em JSON
        } else {
            throw "Erro ao buscar funcionários.";
        }
    }).then(dados=> {
        console.log(dados)
        dados.forEach(dados => {
            slc_componente_parametro.innerHTML+=`<option value='${dados.id_componente}'>${dados.nome}</option>`
        });
    })
}

function buscarParametro(){
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    console.log("Testando", slc_componente_parametro.value);
    
    fetch("/parametros/buscarParametro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_componente: slc_componente_parametro.value
            

        })
    }).then(resposta => {
        if (resposta.ok) { 
        
            return resposta.json(); // transforma a resposta em JSON
        } else {
            throw "Erro ao buscar funcionários.";
        }
    }).then(dados =>{
        console.log("Testando: ",dados);
        listarParametro(dados)
    })
    ;
}

function listarParametro(dados){
const tabela = document.getElementById('parametro-table');

tabela.innerHTML = `<tr>
                        <th>ID</th>
                        <th>ID_Componente</th>
                        <th>Valor</th>
                        <th>Criticidade</th>
                    </tr>`;
    dados.forEach(par => {
        tabela.innerHTML += `
            <tr>
                <td>${par.id_parametro}</td>
                <td>${par.fk_componente}</td>
                <td>${par.valor}</td>
                <td>${par.criticidade}</td>
                <td onclick="excluir(${par.id_parametro})">X</td>
                <td onclick="abrirPopUpEditar('editar-par', ${par.id_parametro})">E</td>
            </tr>
        `;
    });

}

function fecharPopUp(id) {
    popup = document.getElementById(id)
    popup.style.display = "none";
}

function abrirPopUpCadastro(id) {
    popup = document.getElementById(id)
    popup.style.display = "flex";
}

function cadastrar(){
    console.log("Testando:", slc_componente_parametro.value);
    

    fetch("/parametros/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_componente: slc_componente_parametro.value,
            valor: ipt_valor_cadastro.value,
            criticidade: slc_criticidade.value
            })
    })
    .then(function (resposta) {
        console.log(resposta);
        
        if (resposta.ok) {
            fecharPopUp('cadastrar-parametro')
            buscarParametro()            
        }
    })
}

function excluir(id) {
    fetch("/parametros/excluir", {
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
            buscarParametro()
        }
    })
}

function abrirPopUpEditar(idPopUp, idPar) {
    parametroId = idPar
    popup = document.getElementById(idPopUp)
    popup.style.display = "flex";
}

function editar() {
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    fetch("/parametros/editar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id_parametro: parametroId,
            valor: ipt_valor_editar.value,
            criticidade: slc_criticidade_editar.value
        })
    })
    .then(function (resposta) {
        console.log(resposta);
        
        if (resposta.ok) {
            fecharPopUp('editar-par')
            buscarParametro()

        }
    })
}

buscarSetorParametro();
