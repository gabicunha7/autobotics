const overlay_element = document.getElementById('overlay');
document.getElementById("nome-usuario").innerHTML = sessionStorage.NOME_USUARIO;
document.getElementById("email-usuario").innerHTML = sessionStorage.EMAIL_USUARIO;
ctx_historico = document.getElementById('grafico_historico');    
graficoHistorico = null
const dataAtual = new Date();
const dia = dataAtual.getDate();
const mes = dataAtual.getMonth() + 1; 
const ano = dataAtual.getFullYear();
document.getElementById("data_atual").innerHTML = `Data: ${dia}/${mes}/${ano}`;
valores_grafico_historico = [50,60,62,68,75,77];
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
    buscarSerial();
    buscarAlertasSemana();
    buscarQtdDiscosAlerta();
    criticoDoSetor();
});

$('#slc_controlador').on('change', function () {
    previsaoCritico();
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

    graficoHistorico = new Chart(ctx_historico, {
        type: 'line',
        data: {
            labels: jsonData[i].datas,
            datasets: [{
                label: 'Último dado uso de disco',
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
                            yMax: jsonData[i].coeficientes[1] + (jsonData[i].coeficientes[0]),
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
    const resposta = await fetch(`/s3Route/dados/ultimo`);
    const data = await resposta.json();

    console.log("ultimo JSON do bucket:", data);
    sessionStorage.JSON_DISCO = JSON.stringify(data);
    criticoDoSetor()
    previsaoCritico()

  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar último arquivo", message: err.message });
  }
}

 function criticoDoSetor(){
    const dados = JSON.parse(sessionStorage.JSON_DISCO);

    select_setor = document.getElementById("slc_setor");
    select_index = select_setor.selectedIndex;
    varSetor = select_setor.options[select_index].value;
    mediaSetor = null;

    varPorcentagem = document.getElementById("porc-media-setor");

    do{
        mediaSetor = dados[0].mediaSetor[varSetor];
    }while(mediaSetor == null);

    varPorcentagem.innerHTML = mediaSetor;
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