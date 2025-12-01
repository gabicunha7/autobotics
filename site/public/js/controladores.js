function buscarControladores() {
        return fetch("/setores/buscarControladores", {
                method: "POST",
                headers: {
                        "Content-Type": "application/json"
                },
                body: JSON.stringify({
                        setor: sessionStorage.getItem("SETOR_USUARIO"),
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

async function listarControladores() {
        let controladores = await buscarControladores()
        let setores_container = document.getElementById("setor-container")
        for (controlador in controladores) {
                setores_container.innerHTML += `
                        <div onclick="selecionarControlador('${controladores[controlador].numero_serial}')" class="setor-item">
                        <h1>Controlador: ${controladores[controlador].numero_serial}</h1>
                        <div class="setor-values">
                                <p>CPU: ${controladores[controlador].cpu_percent}%</p>
                                <p>RAM: ${controladores[controlador].ram_usada_percent}%</p>
                                <p>DISCO: ${controladores[controlador].disco_usado_percent}%</p>
                        </div>
                        </div>`
        }
}

function selecionarControlador(controlador) {
    sessionStorage.setItem("CONTROLADOR", `${controlador}`)
    window.location.href = sessionStorage.getItem("TELA")
}

listarControladores()