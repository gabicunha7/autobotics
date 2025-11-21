
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