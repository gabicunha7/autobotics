parametroId = null;

function buscarSetorParametro(){
    document.getElementById("nome-usuario").innerHTML = sessionStorage.NOME_USUARIO;
    document.getElementById("email-usuario").innerHTML = sessionStorage.EMAIL_USUARIO;

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
                        <th>Mínimo</th>
                        <th>Criticidade</th>
                        <th>Excluir</th>
                        <th>Editar</th>
                    </tr>`;
    dados.forEach(par => {
        tabela.innerHTML += `
            <tr>
                <td>${par.id_parametro}</td>
                <td>${par.fk_componente}</td>
                <td>${par.valor}</td>
                <td>${par.criticidade == 0 ? "Estável" : par.criticidade == 1 ? "Médio" : "Crítico"}</td>
                <td onclick="excluir(${par.id_parametro})"><img src="assets/icones/lixeira_icon.png"></td>
                <td onclick="abrirPopUpEditar('editar-par', ${par.id_parametro})"><img src="assets/icones/editar_icon.png"></td>
            </tr>
        `;
    });

}

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


function cadastrar(){
    if(slc_componente_parametro.value == ""){
        erros("preencha o campo de componente")
    } else if (slc_criticidade.value == ""){
        erros("preencha o campo de criticidade")
    }else if(ipt_valor_cadastro.value == ""){
        erros("preencha o campo de valor mínimo")
    }else{
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

                if (resposta.ok) {
                    fecharPopUp('cadastrar-parametro')
                    buscarParametro() 
                
                } else {
                    erros("Este componente já tem parâmetro definido");
                }
            }
        )
    }   
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
        
        if (resposta.ok) {
            buscarParametro()
        }
    })
}

function abrirPopUpEditar(idPopUp, idPar) {
    parametroId = idPar
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

function editar() {
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    if(ipt_valor_editar.value == ""){
        erros("preencha o campo de valor mínimo")
    }else{
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
            
            if (resposta.ok) {
                fecharPopUp('editar-par')
                buscarParametro()

            }else {
                erros("Este componente já tem parâmetro definido");
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


buscarSetorParametro();
