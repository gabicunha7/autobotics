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
                setores_container.innerHTML += `
                        <div onclick="selecionarSetor(${setores[setor].id_setor})" class="setor-item">
                        <h1>Setor: ${setores[setor].nome}</h1>
                        <div class="setor-values">
                                <p>CPU: ${setores[setor].cpu_percent}%</p>
                                <p>RAM: ${setores[setor].ram_usada_percent}%</p>
                                <p>DISCO: ${setores[setor].disco_usado_percent}%</p>
                        </div>
                        </div>`
        }
}

function selecionarSetor(setor) {
    sessionStorage.setItem("SETOR_USUARIO", setor)
    window.location.href = "listaControladores.html"
}

listarSetores()