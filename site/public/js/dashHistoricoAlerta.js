
var grafico_alertas = null;

var alertasMesAtual = 0;
var alertasMesAnterior = 0;

function buscarSetor() {
    fetch("/historicoAlerta/buscarSetoresComAlertasTotal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            empresa: sessionStorage.EMPRESA_USUARIO
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
    var tabela = document.getElementById("tabelaSetores");

    dados.forEach(dado => {
        tabela.innerHTML += `<tr onclick="selecionarSetor(${dado.id_setor}, '${dado.nome}')">
                            <td>${dado.nome}</td>
                            <td>${dado.total_alertas}</td>
                            <td>80%</td>
                            <td>75%</td>
                            <td>60%</td>
                            </tr>`
    });
}


function selecionarSetor(idSetor, nomeSetor) {
    console.log(`Setor selecionado: ${nomeSetor} (ID: ${idSetor})`);
    
    
    var mensagemInicial = document.getElementById("mensagemInicial");
    var conteudoDados = document.getElementById("conteudoDados");
    
    if (mensagemInicial) {
        mensagemInicial.style.display = "none";
    }
    if (conteudoDados) {
        conteudoDados.style.display = "flex";
    }
    
    var empresa = sessionStorage.EMPRESA_USUARIO;
    
    buscarAlertaSetorMesAtual(empresa, idSetor);
    buscarAlertaSetorMesAnterior(empresa, idSetor);
    componenteComMaisAlertas(empresa, idSetor);
    
    buscarAlertasGrafico(empresa, idSetor);
}

function buscarAlertaSetorMesAtual(varEmpresa, varSetor) {
    fetch("/historicoAlerta/alertaSetorMesAtual", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            empresa: varEmpresa,
            setor: varSetor
        })
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); 
        } else {
            throw "Erro ao buscar alertas do mês atual.";
        }
    })
    .then(dados => {
        console.log(`Dados mês atual:`, dados);
        listarKpiMesAtual(dados); 
    })
    .catch(erro => {
        console.error(erro);
    });
}

function buscarAlertaSetorMesAnterior(varEmpresa, varSetor) {
    fetch("/historicoAlerta/alertaSetorMesAnterior", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            empresa: varEmpresa,
            setor: varSetor
        })
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); 
        } else {
            throw "Erro ao buscar alertas do mês anterior.";
        }
    })
    .then(dados => {
        console.log(`Dados mês anterior:`, dados);
        listarKpiMesAnterior(dados); 
    })
    .catch(erro => {
        console.error(erro);
    });
}

function listarKpiMesAtual(dados) {
    var mesAtual = document.getElementById("mesAtual");
    
    if (dados && dados.length > 0) {
        alertasMesAtual = dados[0].total_alertas;
        mesAtual.innerHTML = alertasMesAtual;
    } else {
        alertasMesAtual = 0;
        mesAtual.innerHTML = "0";
    }
    
    
    atualizarComparacao();
}

function listarKpiMesAnterior(dados) {
    var mesAnterior = document.getElementById("mesAnterior");
    
    if (dados && dados.length > 0) {
        alertasMesAnterior = dados[0].qtd_alertas;
        mesAnterior.innerHTML = alertasMesAnterior;
    } else {
        alertasMesAnterior = 0;
        mesAnterior.innerHTML = "0";
    }
    
    
    atualizarComparacao();
}

function atualizarComparacao() {
    
    var diferenca = alertasMesAtual - alertasMesAnterior;
    var percentual = 0;
    var titulo = "";
    var cor = "";
    var simbolo = "";

    
    if (alertasMesAnterior > 0) {
        percentual = ((diferenca / alertasMesAnterior) * 100).toFixed(1);
    } else if (alertasMesAtual > 0) {
        percentual = 100;
    }

    
    if (diferenca > 0) {
        titulo = "Aumento de:";
        cor = "#e74c3c";
        simbolo = "▲";
    } else if (diferenca < 0) {
        titulo = "Diminuição de:";
        cor = "#27ae60"; 
        simbolo = "▼";
        diferenca = Math.abs(diferenca); 
        percentual = Math.abs(percentual);
    } else {
        titulo = "Sem variação:";
        cor = "#95a5a6"; 
        simbolo = "–";
    }

    
    var comparacaoCol = document.querySelector(".comparacao-col:nth-child(3)");
    if (comparacaoCol) {
        comparacaoCol.innerHTML = `
            <div class="comp-subtitulo">${titulo}</div>
            <div class="comp-valor">${diferenca} <span class="texto-alertas">alertas</span></div>
            <div class="comp-percentual" style="color: ${cor};">${simbolo} ${Math.abs(percentual)}%</div>
        `;
    }
}


function buscarAlertasGrafico(varEmpresa, varSetor) {
    fetch("/historicoAlerta/alertasPorMes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            empresa: varEmpresa,
            setor: varSetor
        })
    })
    .then(resposta => {
        if (resposta.ok) {
            return resposta.json(); 
        } else {
            throw "Erro ao buscar alertas por mês.";
        }
    })
    .then(dados => {
        console.log(`Dados do gráfico:`, dados);
        atualizarGrafico(dados); 
    })
    .catch(erro => {
        console.error(erro);
    });
}


function atualizarGrafico(dados) {
    if (!grafico_alertas) {
        console.error("Gráfico não inicializado");
        return;
    }

    if (dados && dados.length > 0) {
        const registro = dados[0];
        
        
        const novosDados = [
            registro.Janeiro,
            registro.Fevereiro,
            registro.Março,
            registro.Abril,
            registro.Maio,
            registro.Junho,
            registro.Julho,
            registro.Agosto,
            registro.Setembro,
            registro.Outubro,
            registro.Novembro,
            registro.Dezembro 
        ];

       
        grafico_alertas.data.datasets[0].data = novosDados;
        grafico_alertas.update();
    }
}


function componenteComMaisAlertas(varEmpresa, varSetor) {
    fetch("/historicoAlerta/componenteComMaisAlertas", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            empresa: varEmpresa,
            setor: varSetor
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
            exibirComponenteMaisAlertas(dados);    
    })
    .catch(erro => {
        console.error(erro);
    });
}

function exibirComponenteMaisAlertas(dados){
    var componenteMaisAlertas = document.querySelector("#componenteMaisAlertas");
    var componenteSubtitulo = document.querySelector("#componenteSubtitulo");
    var qtd_alertasComponente = document.querySelector(".qtd_alertasComponente");

    console.log("Dados do componente com mais alertas:", dados);

    if(dados && dados.length > 0){
        componenteMaisAlertas.innerHTML = dados[0].componente_mais_alerta;
        componenteSubtitulo.innerHTML = dados[0].componente_mais_alerta;
        qtd_alertasComponente.innerHTML = dados[0].quantidade_de_alertas;
    }else{
        componenteMaisAlertas.innerHTML = 0;
        componenteSubtitulo.innerHTML = 0;
        qtd_alertasComponente.innerHTML = 0;
    }

}


buscarSetor();