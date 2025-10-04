funcionarioId = null

function cadastrar(){
    varEmpresa = sessionStorage.EMPRESA_USUARIO;

    if(ipt_nome.value == ""){
        erros("preencha o campo de nome")
    } else if (ipt_descricao.value == ""){
        erros("preencha o campo de descrição")
    } else{
        fetch("/setor/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: ipt_nome.value.trim(),
            descricao: ipt_descricao.value.trim(),
            empresa: varEmpresa
        })
        })
        .then(function (resposta) {
            console.log(resposta);
            fecharPopUp("cadastrar-setor")
        }
    )}   
}

function abrirPopUpCadastro(id) {
    popup = document.getElementById(id)
    popup.style.display = "flex";
}

function fecharPopUp(id) {
    popup = document.getElementById(id)
    popup.style.display = "none";
    buscarSetor()
}

function excluir(id) {
    varEmpresa = sessionStorage.EMPRESA_USUARIO;

    fetch("/setor/excluir", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id:id,
            empresa: varEmpresa
        })
    })
    .then(function (resposta) {
        console.log(resposta);
        
        if (resposta.ok) {
            buscarSetor()
        }else {
            erros("Você tem parãmetros  neste setor, delete eles para excluir");
        }
    })
}

function editar() {
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    fetch("/setor/editar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id:funcionarioId,
            nome: ipt_nome_editar.value.trim(),
            descricao: ipt_descricao_editar.value.trim(),
            empresa: varEmpresa
        })
    })
    .then(function (resposta) {
        console.log(resposta);
        
        if (resposta.ok) {
            fecharPopUp("editar-setor")
            buscarSetor()      
        }
        
    })
}

function abrirPopUpEditar(idPopUp, idFunc) {
    funcionarioId = idFunc
    popup = document.getElementById(idPopUp)
    popup.style.display = "flex";
}


function listar(dados) {
    const tabela = document.getElementById('setor-table');

    console.log("TESTE");
    console.log(dados);

    tabela.innerHTML = `<tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Ação</th>
                    </tr>`;

    dados.forEach(func => {
        tabela.innerHTML += `
            <tr>
                <td>${func.id_setor}</td>
                <td>${func.nome}</td>
                <td>${func.descricao}</td>
                <td onclick="excluir(${func.id_setor})">X</td>
                <td onclick="abrirPopUpEditar('editar-setor', ${func.id_setor})">E</td>
            </tr>
        `;
    });
}


function buscarSetor() {
    varEmpresa = sessionStorage.EMPRESA_USUARIO;

    fetch("/setor/buscarSetor", {
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
            throw "Erro ao buscar setor.";
        }
    })
    .then(dados => {
        listar(dados); // chama listar já com os dados prontos
    })
    .catch(erro => {
        console.error(erro);
    });
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


buscarSetor()