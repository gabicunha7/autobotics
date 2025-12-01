function buscarSetores() {
        return fetch("/setores/buscarSetores", {
                method: "POST",
                headers: {
                        "Content-Type": "application/json"
                },
                body: JSON.stringify({
                        empresa: sessionStorage.getItem("EMPRESA_USUARIO")
                })
        })
                .then(resposta => {
                        if (!resposta.ok) {
                                throw "Erro ao buscar parâmetros do setor.";
                        }
                        else {
                                return resposta.json();
                        }
                })
                .then(dados => {
                        console.log(dados);

                        return dados
                })
                .catch(erro => {
                        console.error(erro);
                        return null
                });
}

async function listarSetores() {
        let setores = await buscarSetores()
        let setores_container = document.getElementById("setor-container")

        for (setor in setores) {

                if (setores[setor].total_alertas > 10) {
                        corKpi = "#e6ac00"
                } else if (setores[setor].total_alertas > 30) {
                        corKpi = "#E71831"
                } else {
                        corKpi = "#4CAF50"
                }

                setores_container.innerHTML += `
                        <div onclick="selecionarSetor(${setores[setor].id_setor})" class="setor-item">
                        <h1>Setor: ${setores[setor].nome}</h1>
                        <div class="setor-values">
                        <p>Quantidade de Alertas (hoje): <span style="color: ${corKpi};">${setores[setor].total_alertas}</span></p>
                        </div>
                        </div>`
        }
}

function selecionarSetor(setor) {
        sessionStorage.setItem("SETOR_USUARIO", setor)
        window.location.href = "listaControladores.html"
}

listarSetores()