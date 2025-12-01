(async function initJsonS3() {
    console.log("Carregando JSON do S3...");
    await criarVariavelJsonS3();
    console.log("JSON S3 pronto.");
})();

let meuJsonRecebido = null;

$('#slc_setor').select2({
    language: {
        noResults: function () {
            return "nenhum setor encontrado";
        }
    }
});

$('#slc_setor').on('change', function () {
    buscarSerial();
    listarAlertasNoSetor();
    componenteComMaisAlertas();
    totalAlertasNoSetor();
    listarComponenteAlertas();
    qtdAlertasPorNivelNaSemana();
    exibirGraficosAlertasPorNivel();
    topControladores();
    exibirGraficoControladoresAlertas();
    exibirPicoMediaComponente();
});


$('#slc_controlador').on('change', function () {
    buscarNomeControlador();
    qtdAlertasPorNivelNaSemana();
    exibirPicoMediaComponente();
});


$('#slc_controlador').select2({
    language: {
        noResults: function () {
            return "nenhum controlador encontrado";
        }
    }
});

$('#slc_componente').on('change', function () {
    exibirPicoMediaComponente();
    buscarNomeControlador();
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

    $('#slc_setor').select2({
        language: {
            noResults: function () {
                return "nenhum setor encontrado";
            }
        }
    });
    mudarValorSelectSetor()
    listarAlertasNoSetor()
    buscarSerial()
    exibirGraficoControladoresAlertas()
    totalAlertasNoSetor()
    componenteComMaisAlertas()
    topControladores()
    exibirPicoMediaComponente()
    listarComponenteAlertas()
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
    exibirGraficoControladoresAlertas();
    qtdAlertasPorNivelNaSemana()
    mudarValorSelectControlador()
}

function mudarNomeSetor(dado) {
    mudarValorSelectSetor()
    nomeSetor = document.getElementById("nome-setor");
    console.log(dado)
    nomeSetor.innerHTML = dado[0].nome
}

function mudarNomeControlador(dado) {
    nomeControlador = document.getElementById("nome-controlador");
    console.log(dado)
    nomeControlador.innerHTML = dado[0].numero_serial
}

//KPI de total de alertas no setor (hoje)

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


function listarAlertasNoSetor(dado) {
    totalAlertas = document.getElementById("total-alertas-hoje");
    divKpis = document.getElementById("kpis");
    corKpi = ""

    console.log("Dado: " + dado)
    if (typeof dado != "object") {
        totalAlertas.innerHTML = 0;
    } else {
        if (dado[0].total_alertas > 10) {
            corKpi = "#e6ac00"
        } else if (dado[0].total_alertas > 30) {
            corKpi = "#E71831"
        } else {
            corKpi = "#4CAF50"
        }
        totalAlertas.innerHTML = dado[0].total_alertas;
    }

    trocaCorKpiAlertas(corKpi);
}

//KPI de componente de controlador com mais alertas no setor (hoje)

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

function listarComponenteAlertas(dado) {
    componenteAlertas = document.getElementById("alertas-componente-controlador");
    console.log("Componente com mais alertas: " + dado)
    if (typeof dado != "object") {
        componenteAlertas.innerHTML = "Nenhum"
    } else {
        componenteAlertas.innerHTML = dado[0].componente_mais_alerta;
    }
}

//Gráfico de Controladores com mais alertas no setor (hoje)

function topControladores() {
    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;

    fetch("/manutencao/topControladores", {
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
                throw "Erro ao buscar os controladores com mais alertas.";
            }
        })
        .then(dados => {
            exibirGraficoControladoresAlertas(dados);
        })
        .catch(erro => {
            console.error(erro);
        });
}

function exibirGraficoControladoresAlertas(dado) {
    console.log("controladores com mais alertas:", dado);

    controladores = [];
    qtdAlertas = [];

    if (typeof dado != "object") {
        controladores = 0;
        qtdAlertas = 0;
    } else {
        for (let i = 0; i < dado.length; i++) {
            controladores[i] = dado[i].nome_controlador;
            qtdAlertas[i] = dado[i].quantidade_alertas;
        }
    }

    criarGraficoTopControladores(controladores, qtdAlertas);
}

// Gráfico de quantidade de alertas por nível na semana

function qtdAlertasPorNivelNaSemana() {
    select_controlador = document.getElementById("slc_controlador");
    select_index = select_controlador.selectedIndex;
    varSetor = select_controlador.options[select_index].value;

    fetch("/manutencao/qtdAlertasPorNivelNaSemana", {
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
                throw "Erro ao quantidade de alertas por nível";
            }
        })
        .then(dados => {
            exibirGraficosAlertasPorNivel(dados);
        })
        .catch(erro => {
            console.error(erro);
        });
}

function exibirGraficosAlertasPorNivel(dado) {
    console.log("Quantidade de alertas por nível (na semana):", dado);

    dataAlertasFormatadas = [];
    alertasMedios = [];
    alertasCriticos = [];

    if (!Array.isArray(dado) || dado.length === 0) {
        dataAlertasFormatadas = [];
        alertasMedios = [];
        alertasCriticos = [];
    } else {
        for (let i = 0; i < dado.length; i++) {
            const dataOriginal = new Date(dado[i].data_alerta);
            dataAlertasFormatadas[i] = dataOriginal.toLocaleDateString('pt-BR');

            alertasMedios[i] = dado[i].qtd_nivel_medio;
            alertasCriticos[i] = dado[i].qtd_nivel_critico;
        }
    }
    criarGraficoAlertasPorNivel(dataAlertasFormatadas, alertasMedios, alertasCriticos);
}

//Gráfico de Pico e Média de uso do "Componente" (na semana)

//Primeiro faço a conexão do s3
async function carregarUltimoJson() {
    try {
        const resposta = await fetch(`/s3RouteManutencao/dados/ultimo`);
        const data = await resposta.json();

        console.log("ultimo JSON do bucket:", data);

        return data;

    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar último arquivo", message: err.message });
    }
}

async function criarVariavelJsonS3() {
    meuJsonRecebido = await carregarUltimoJson();

    console.log("Json recebido:" + meuJsonRecebido.mediaRam["0010"])
    exibirPicoMediaComponente();
}

function exibirPicoMediaComponente() {
    if (!meuJsonRecebido) {
        console.warn("JSON ainda não carregado.");
        return;
    }

    select_componente = document.getElementById("slc_componente");
    select_index = select_componente.selectedIndex;
    varComponente = select_componente.options[select_index].value;

    select_controlador = document.getElementById("slc_controlador");
    select_index = select_controlador.selectedIndex;
    varControlador = select_controlador.options[select_index].value;

    nomeComponente = document.getElementById("nome-componente")

    console.log("Controlador selecionado:", varControlador);

    if (!varControlador) {
        console.warn("Nenhum controlador selecionado.");
        return;
    }

    dias = [];

    for (let i = 6; i >= 0; i--) {
        let dia = new Date();
        dia.setDate(dia.getDate() - i);
        dias.push(dia.toLocaleDateString("pt-BR"));
    }

    console.log(dias)

    media = [];
    pico = [];

    if (varComponente === "RAM") {
        media = meuJsonRecebido.mediaRam[varControlador];
        pico = meuJsonRecebido.picoRam[varControlador];
        nomeComponente.innerHTML = varComponente

    } else if (varComponente === "CPU") {
        media = meuJsonRecebido.mediaCpu[varControlador];
        pico = meuJsonRecebido.picoCpu[varControlador];
        nomeComponente.innerHTML = varComponente
    }

    criarGraficoPicoMediaComponente(media, pico, dias)
}

//Mudando o Setor e Controlador 

function mudarValorSelectSetor(){
    select_setor = document.getElementById("slc_setor");

    for(i = 0; i < select_setor.options.length; i++){
        if(select_setor.options[i].value == sessionStorage.getItem("SETOR_USUARIO")){
            select_setor.selectedIndex = i
            break;
        }
    }
    select_setor.dispatchEvent(new Event("change"));
}

function mudarValorSelectControlador(){
    select_controlador = document.getElementById("slc_controlador");

    for(i = 0; i < select_controlador.options.length; i++){
        if(select_controlador.options[i].value == sessionStorage.getItem("CONTROLADOR")){
            select_controlador.selectedIndex = i
            break;
        }
    }
    select_controlador.dispatchEvent(new Event("change"));
}