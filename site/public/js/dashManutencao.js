    $('#slc_setor').select2({language: {
      	noResults: function() {
        return "nenhum setor encontrado";}}
    });

    $('#slc_setor').on('change', function () {
    buscarSerial();
    listarAlertasNoSetor();
    componenteComMaisAlertas();
    totalAlertasNoSetor();
    listarComponenteAlertas();
    });


    $('#slc_controlador').on('change', function () {
    buscarNomeControlador();
    });


        $('#slc_controlador').select2({language: {
      	noResults: function() {
        return "nenhum controlador encontrado";}}
    });

    function buscarSetor() {
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    
    fetch("/manutencao/buscarSetor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            empresa: varEmpresa,

        })
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); 

        } else {
            throw "Erro ao buscar setores.";
        }
    })
    .then(dados => {
        listarSetores(dados); 
    })
    .catch(erro => {
        console.error(erro);
    });
}

function listarSetores(dados) {
    const select_setor = document.getElementById('slc_setor');

    dados.forEach(dado => {
        select_setor.innerHTML += `<option value="${dado.id_setor}">${dado.nome}</option>`;
    });
    buscarSerial()
    totalAlertasNoSetor()
    componenteComMaisAlertas()
}

function buscarSerial() {
    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;

    buscarNomeSetor();
    
    fetch("/manutencao/buscarSerial", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            setor: varSetor,

        })
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); 
        } else {
            throw "Erro ao buscar numeros Seriais.";
        }
    })
    .then(dados => {
        listarNumSeriais(dados); 
    })
    .catch(erro => {
        console.error(erro);
    });
}

function buscarNomeSetor() {
    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;


    
    fetch("/manutencao/buscarNomeSetor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            setor: varSetor,

        })
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); 
        } else {
            throw "Erro ao buscar nome do setor.";
        }
    })
    .then(dados => {
        mudarNomeSetor(dados); 
    })
    .catch(erro => {
        console.error(erro);
    });
}

function buscarNomeControlador() {
    select_controlador = document.getElementById("slc_controlador");
    select_index = select_controlador.selectedIndex;
    varSetor = select_controlador.options[select_index].value;


    
    fetch("/manutencao/buscarNomeControlador", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            setor: varSetor,    

        })
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); 
        } else {
            throw "Erro ao buscar nome do controlador";
        }
    })
    .then(dados => {
        mudarNomeControlador(dados); 
    })
    .catch(erro => {
        console.error(erro);
    });
}

function listarNumSeriais(dados) {
    const select_controlador = document.getElementById('slc_controlador');
    select_controlador.innerHTML = "";

    dados.forEach(dado => {
        select_controlador.innerHTML += `<option value="${dado.numero_serial}">${dado.numero_serial}</option>`;
    });
    buscarNomeControlador();
}

function mudarNomeSetor(dado){
    nomeSetor = document.getElementById("nome-setor");
    console.log(dado)
    nomeSetor.innerHTML = dado[0].nome
}

function mudarNomeControlador(dado){
    nomeControlador = document.getElementById("nome-controlador");
    console.log(dado)
    nomeControlador.innerHTML = dado[0].numero_serial
}


function totalAlertasNoSetor() {
    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;
    
    fetch("/manutencao/totalAlertasNoSetor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            setor: varSetor,

        })
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); 
        } else {
            throw "Erro ao buscar alertas do setor.";
        }
    })
    .then(dados => {
            listarAlertasNoSetor(dados);    
    })
    .catch(erro => {
        console.error(erro);
    });
}


function listarAlertasNoSetor(dado){
    totalAlertas = document.getElementById("total-alertas-hoje");
    console.log("Dado: " + dado)
    if(typeof dado != "object"){
        totalAlertas.innerHTML = 0;
    } else{
        totalAlertas.innerHTML = dado[0].total_alertas;
    }
}

function componenteComMaisAlertas() {
    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;
    
    fetch("/manutencao/componenteComMaisAlertas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            setor: varSetor,

        })
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); 
        } else {
            throw "Erro ao buscar componente com mais alertas.";
        }
    })
    .then(dados => {
            listarComponenteAlertas(dados);    
    })
    .catch(erro => {
        console.error(erro);
    });
}

function listarComponenteAlertas(dado){
    componenteAlertas = document.getElementById("alertas-componente-controlador");
    console.log("Componente com mais alertas: " + dado)
    if(typeof dado != "object"){
        componenteAlertas.innerHTML = "Nenhum"
    } else {
        componenteAlertas.innerHTML = dado[0].componente_mais_alerta;
    }
}