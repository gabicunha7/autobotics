
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
    });

    $('#slc_controlador').select2({language: {
      	noResults: function() {
        return "nenhum controlador encontrado";}}
    });

    const dataAtual = new Date();
    const dia = dataAtual.getDate();
    const mes = dataAtual.getMonth() + 1; 
    const ano = dataAtual.getFullYear();

    document.getElementById("data_atual").innerHTML = `Data: ${dia}/${mes}/${ano}`;


    document.getElementById("nome-usuario").innerHTML = sessionStorage.NOME_USUARIO;
    document.getElementById("email-usuario").innerHTML = sessionStorage.EMAIL_USUARIO;

    
    const ctx_historico = document.getElementById('grafico_historico');    
    valores_grafico_historico = [39,41,44,47,50,60,62,68,75,77];

    new Chart(ctx_historico, {
        type: 'line',
        data: {
            labels: ['Janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
            datasets: [{
                label: 'Último dado uso de disco',
                data: valores_grafico_historico, 
                borderWidth: 2,
                borderColor: '#4c5caf'
            },{
                label: 'regressão',
                data: valores_grafico_historico, 
                borderWidth: 2,
                borderColor: 'purple'
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
                            yMin: Math.min(...valores_grafico_historico),
                            yMax: 87,
                            borderColor: 'purple',
                            borderWidth: 2
                        },                        
                        Crítico: {
                            type: 'line',
                            yMin: 80,
                            yMax: 80,
                            borderColor: 'red',
                            borderWidth: 2
                        },
                        
                    }
                }
    }
        }});

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
}
