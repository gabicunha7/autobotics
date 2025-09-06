let email = document.querySelector('#email');
let senha = document.querySelector('#senha');

let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validar() {
    let erros = 0;

    if (!emailRegex.test(email.value)) {
        let prox = email.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "O email é inválido";

            email.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = email.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }

    if (senha.value.trim().length < 6) {
        let prox = senha.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "A senha deve conter pelo menos 6 caracteres";

            senha.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = senha.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }

    if (erros == 0) {
        entrar();
    }
}

function entrar() {
    aguardar();

    if (email.value == "root" && senha.value == "Sptech#2024") {
        window.location.href = "empresas.html";
    }

    fetch("/usuarios/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.value.trim(),
            senha: senha.value.trim()
        })
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                setTimeout(() => {
                    window.location = "dashboards.html";
                }, "1000");

            } else {
                resposta.json().then(json => {
                    console.error(json.mensagem);
                    finalizarAguardar(json.mensagem);
                })
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });

}