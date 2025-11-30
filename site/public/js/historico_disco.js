const overlay_element = document.getElementById('overlay');
document.getElementById("nome-usuario").innerHTML = sessionStorage.NOME_USUARIO;
document.getElementById("email-usuario").innerHTML = sessionStorage.EMAIL_USUARIO;
ctx_historico = document.getElementById('grafico_historico');    
graficoHistorico = null
setorCRITICO = null;
setorMEDIO = null;
const dataAtual = new Date();
const dia = dataAtual.getDate();
const mes = dataAtual.getMonth() + 1; 
const ano = dataAtual.getFullYear();
document.getElementById("data_atual").innerHTML = `Data: ${dia}/${mes}/${ano}`;
const meses_texto = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
];
if (overlay_element) overlay_element.addEventListener('click', fecharTodosPopups);

function fecharTodosPopups(){
    const ids = ['alertas_semana'];
    ids.forEach(id => {
        const p = document.getElementById(id);
        if (p) p.style.display = 'none';
    });

    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
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

$('#slc_setor').select2({language: {
    noResults: function() {
    return "nenhum setor encontrado";}}
});

$('#slc_setor').on('change', function () {
    buscarCriticoSetor();
    buscarSerial();
    buscarAlertasSemana();
    buscarQtdDiscosAlerta();
});

$('#slc_controlador').on('change', function () {
    previsaoCritico();
    buscarCriticoSetor();
    calculaRquad();
});

$('#slc_controlador').select2({language: {
    noResults: function() {
    return "nenhum controlador encontrado";}}
});

    let regressao = []
    const meses_ano = [1,2,3,4,5,6,7,8,9,10,11,12]
    somaX = 0
    somaY = 0

    function calcRegressao(list){
        somaX = 0
        somaY = 0
        for(i = 0; i < list.length; i++){
            somaX += list
        }
    }


    
function buscarSetor() {
    varEmpresa = sessionStorage.EMPRESA_USUARIO;
    
    fetch("/disco/buscarSetor", {
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
    buscarAlertasSemana()
    buscarQtdDiscosAlerta()
}

function buscarSerial() {
    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;
    
    fetch("/disco/buscarSerial", {
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
        buscarCriticoSetor();
        listarStatusControladores()
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
    previsaoCritico()
    calculaRquad()
    let timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        mediaDoSetor()
        listarStatusControladores();
    }, 200);
}


function buscarAlertasSemana() {
    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;
    
    fetch("/disco/buscarAlertasSemana", {
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
            throw "Erro ao buscar alertas.";
        }
    })
    .then(dados => {
        listarAlertas(dados); 
    })
    .catch(erro => {
        console.error(erro);
    });
}

function listarAlertas(dados) {
    const tabela = document.getElementById('alerta-table');
    tabela.innerHTML = "";

    tabela.innerHTML = `<tr>
                            <th>Timestamp</th>
                            <th>Número Serial</th>
                            <th>% de uso</th>
                            <th>Status</th>
                        </tr>`;

    dados.forEach(dado => {
        status_do_alerta = dado.criticidade == 1 ? '<p style="background-color: #e6ac00!important;border-radius: 10px;">Médio</p>' : '<p style="background-color: #ff3f2e!important;border-radius: 10px;">Crítico</p>'
        tabela.innerHTML += `
                            <tr>
                                <td>${dado.timestamp}</td>
                                <td>${dado.numero_serial}</td>
                                <td>${dado.valor}</td>
                                <td>${status_do_alerta}</td>
                            </tr>`;
    });
}

function buscarQtdDiscosAlerta() {
    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;
    
    fetch("/disco/buscarQtdDiscosAlerta", {
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
            throw "Erro ao buscar qtd de alertas.";
        }
    })
    .then(dados => {
        listarQtdDiscosAlerta(dados); 
    })
    .catch(erro => {
        console.error(erro);
    });
}

function listarQtdDiscosAlerta(dados) {
    qtd_alertas = document.getElementById('quantidade-alertas');

    dados.forEach(dado => {
        qtd_alertas.innerHTML = dado.contagem;
    });
}


function buscarCriticoSetor() {
    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;
    
    fetch("/disco/buscarCriticoSetor", {
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
            throw "Erro ao buscar critico do setor.";
        }
    })
    .then(dados => {
        setorCRITICO = dados[0].valor
        setorMEDIO = dados[1].valor
        trocarGrafico(dados); 
    })
    .catch(erro => {
        console.error(erro);
    });
}

function trocarGrafico(dados) {
    const jsonData = JSON.parse(sessionStorage.JSON_DISCO);

    select_controlador = document.getElementById("slc_controlador");
    campoCritico = document.getElementById("previsao-critico");
    select_index = select_controlador.selectedIndex;
    varControlador = select_controlador.options[select_index].value;

    for(i = 0; i < jsonData.length; i++){
        if(jsonData[i].codigo == varControlador){
            break;
        }
    }

    if(graficoHistorico != null){
        graficoHistorico.destroy();
    } 

    meses = []
    
    jsonData[i].datas.forEach(e => {
        e = new Date(e)
        meses.push(meses_texto[e.getMonth()])
    });

    graficoHistorico = new Chart(ctx_historico, {
        type: 'line',
        data: {
            labels: meses,
            datasets: [{
                label: 'Média do uso de disco no mês',
                data: jsonData[i].medias, 
                borderWidth: 2,
                borderColor: '#4c5caf'
            }
        ]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Meses',
                        font: {
                            size: 18
                        }
                    },
                    ticks: {
                        font: {
                            size: 16
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Uso de disco em porcentagem %',
                        font: {
                            size: 18
                        }
                    },
                    ticks: {
                        font: {
                            size: 16
                        }
                    }
                }
            },
            plugins: {
                annotation: {
                    annotations: {
                        regressao: {
                            type: 'line',
                            yMin: jsonData[i].coeficientes[1],
                            yMax: jsonData[i].coeficientes[1] + (jsonData[i].coeficientes[0] * jsonData[i].mudaCadaData[5]),
                            borderColor: 'purple',
                            borderWidth: 2
                        },                        
                        Crítico: {
                            type: 'line',
                            yMin: dados[0].valor,
                            yMax: dados[0].valor,
                            borderColor: 'red',
                            borderWidth: 2
                        },
                        
                    }
                }
            }
        }
    }
)};

async function carregarUltimoJson() {
  try {
    aguardar()
    const resposta = await fetch(`/s3Route/dados/ultimo`);
    const data = await resposta.json();

    console.log("ultimo JSON do bucket:", data);
    sessionStorage.JSON_DISCO = JSON.stringify(data);
    acabouAguardar()
    buscarSetor()


  } catch (err) {
    console.log("Erro ao buscar último arquivo" + err.message );
  }
}

 function mediaDoSetor(){
    const dados = JSON.parse(sessionStorage.JSON_DISCO);

    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;
    mediaSetor = null;

    varPorcentagem = document.getElementById("porc-media-setor");

    do{
        mediaSetor = dados[0].mediaSetor[varSetor];
    }while(mediaSetor == null);

    if(mediaSetor >= setorCRITICO){
        varPorcentagem.innerHTML = '<p style="color:#ff3f2e;font-size:2.5rem;">'+ mediaSetor + '</p>';
    } else if(mediaSetor >= setorMEDIO){
        varPorcentagem.innerHTML = '<p style="color:#e6ac00;font-size:2.5rem;">'+ mediaSetor + '</p>';
    }else{
        varPorcentagem.innerHTML = '<p style="color:#4CAF50;font-size:2.5rem;">'+ mediaSetor + '</p>';
    }
}

function previsaoCritico(){
    const dados = JSON.parse(sessionStorage.JSON_DISCO);

    select_controlador = document.getElementById("slc_controlador");
    campoCritico = document.getElementById("previsao-critico");
    select_index = select_controlador.selectedIndex;
    varControlador = select_controlador.options[select_index].value;

    for(i = 0; i < dados.length; i++){
        if(dados[i].codigo == varControlador){
            break;
        }
    }

    campoCritico.innerHTML = dados[i].dataCritica
}

function listarStatusControladores() {
    const dados = JSON.parse(sessionStorage.JSON_DISCO);

    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;

    const tabela = document.getElementById('controlador-table');
    linhas = ""

    linhas += `<tr>
                            <th>Número Serial</th>
                            <th>Previsão</th>
                            <th>Status</th>
                            <th>Visualizar</th>
                        </tr>
                        `;

    for(i = 0; i < dados.length; i++){
        if(varSetor == dados[i].idSetor){
            if(Number(dados[i].medias[5]) >= Number(setorCRITICO)){
                status_alerta = '<p style="background-color: #ff3f2e!important;border-radius: 10px;">Crítico</p>'
            }else if(Number(dados[i].medias[5]) >= Number(setorMEDIO)){
                status_alerta = '<p style="background-color: #e6ac00!important;border-radius: 10px;">Médio</p>' 
            }else{
                status_alerta = '<p style="background-color: #4CAF50!important;border-radius: 10px;">Estável</p>' 
            }
            linhas += `
                                <tr>
                                    <td>${dados[i].codigo}</td>
                                    <td>${dados[i].quantoFalta}</td>
                                    <td>${status_alerta}</td>
                                    <td onclick="mudarValorSelect('${dados[i].codigo}')"><img src="assets/icones/dashboard.png"></td>
                                </tr>`;
        }
    }

    tabela.innerHTML = linhas
}

function mudarValorSelect(codigo){
    select_controlador = document.getElementById("slc_controlador");

    for(i = 0; i < select_controlador.options.length; i++){
        if(select_controlador.options[i].value == codigo){
            select_controlador.selectedIndex = i
            break;
        }
    }
    select_controlador.dispatchEvent(new Event("change"));
}

function calculaRquad(){
    const dados = JSON.parse(sessionStorage.JSON_DISCO);

    select_controlador = document.getElementById("slc_controlador");
    select_index = select_controlador.selectedIndex;
    varControlador = select_controlador.options[select_index].value;

    i = 0
    for(; dados.length; i++){
        if(dados[i].codigo == varControlador){
            break;
        }
    }
    
    
    dados[i].mudaCadaData
    somaMedias = 0;
    SQT = 0;
    SQres = 0;

    for(j = 0; j < dados[i].medias.length; j++){
        somaMedias += dados[i].medias[j]
    }
    media = somaMedias / dados[i].medias.length

    for(j = 0; j < dados[i].medias.length; j++){
        SQT += Math.pow(dados[i].medias[j] - media,2)
    }

    for(j = 0; j < dados[i].medias.length; j++){
        SQres += Math.pow(dados[i].medias[j] - ((dados[i].mudaCadaData[j] * dados[i].coeficientes[0]) + dados[i].coeficientes[1]),2)
    }

    valor_squad = document.getElementById("squad");
    valor_squad.innerHTML = (1 - (SQres / SQT)).toFixed(2) * 100 + "%"
}
