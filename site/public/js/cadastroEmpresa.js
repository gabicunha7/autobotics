const carrossel = document.querySelector('.carrossel-cadastro');

let nome = document.querySelector('#nome_empresa');
let cnpj = document.querySelector('#cnpj');
let nomeRepresentante = document.querySelector('#nome_representante');
let emailRepresentante = document.querySelector('#email_representante');
let senhaRepresentante = document.querySelector('#senha_representante');

let cep = document.querySelector('#cep');
let estado = document.querySelector('#estado');
let cidade = document.querySelector('#cidade');
let bairro = document.querySelector('#bairro');
let logradouro = document.querySelector('#logradouro');

let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function validarEmpresa() {
    let erros = 0;

    if (nome.value.trim().length < 2) {
        let prox = nome.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "O nome da empresa deve conter pelo menos 2 caracteres";

            nome.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = nome.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }

    if (cnpj.value.trim().length != 18) {
        let prox = cnpj.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "O cnpj é inválido"

            cnpj.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = cnpj.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }

    if (nomeRepresentante.value.trim().length < 2) {
        let prox = nomeRepresentante.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "O nome do representante deve conter pelo menos 2 caracteres";

            nomeRepresentante.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = nomeRepresentante.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }

    if (!emailRegex.test(emailRepresentante.value)) {
        let prox = emailRepresentante.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "O email é inválido";

            emailRepresentante.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = emailRepresentante.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }

    if (senhaRepresentante.value.trim().length < 6) {
        let prox = senhaRepresentante.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "A senha deve conter pelo menos 6 caracteres";

            senhaRepresentante.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = senhaRepresentante.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }



    if (erros == 0) {
        avancar(1)
    }

}

function validarEndereco() {
    let erros = 0;

    if (cep.value.trim().length < 9) {
        let prox = cep.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "O cep é inválido";

            cep.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = cep.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }

    if (estado.value.trim().length != 2) {
        let prox = estado.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "O estado é inválido";

            estado.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = estado.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }

    if (cidade.value.trim().length < 3) {
        let prox = cidade.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "O cidade é inválido";

            cidade.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = cidade.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }

    if (bairro.value.trim().length < 2) {
        let prox = bairro.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "O bairro é inválido";

            bairro.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = bairro.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }

    if (logradouro.value.trim().length < 2) {
        let prox = logradouro.nextElementSibling;

        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "O logradouro é inválido";

            logradouro.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = logradouro.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }

    if (erros == 0) {
        cadastrar();
    }
}


cnpj.addEventListener("input", function () {
    let limparValor = cnpj.value.replace(/\D/g, "").substring(0, 14);

    let numerosArray = limparValor.split("");

    let numeroFormatado = "";

    if (numerosArray.length > 0) {
        numeroFormatado += `${numerosArray.slice(0, 2).join("")}`;
    }

    if (numerosArray.length > 2) {
        numeroFormatado += `.${numerosArray.slice(2, 5).join("")}`;
    }

    if (numerosArray.length > 5) {
        numeroFormatado += `.${numerosArray.slice(5, 8).join("")}`;
    }

    if (numerosArray.length > 8) {
        numeroFormatado += `/${numerosArray.slice(8, 12).join("")}`;
    }

    if (numerosArray.length > 12) {
        numeroFormatado += `-${numerosArray.slice(12, 14).join("")}`;
    }

    cnpj.value = numeroFormatado;
});

cep.addEventListener('input', async function () {
    let limparValor = cep.value.replace(/\D/g, "").substring(0, 14);

    let numerosArray = limparValor.split("");

    let numeroFormatado = "";

    if (numerosArray.length > 0) {
        numeroFormatado += `${numerosArray.slice(0, 5).join("")}`;
    }

    if (numerosArray.length > 5) {
        numeroFormatado += `-${numerosArray.slice(5, 8).join("")}`;
    }

    cep.value = numeroFormatado;

    if (cep.value.trim().length == 9) {
        let cepDigitado = cep.value.replace('-', '');

        let retornoConvertido = await fetch(`https://viacep.com.br/ws/${cepDigitado}/json/`)
            .then((resposta) => resposta.json());

        console.log(retornoConvertido);


        if (retornoConvertido.erro) {
            let prox = cep.nextElementSibling;

            if (prox.tagName != 'SPAN') {
                let span = document.createElement('span');
                span.classList.add('erro');
                span.textContent = "O cep é inválido"

                cep.insertAdjacentElement('afterend', span);
            }

            estado.value = '';
            cidade.value = '';
            bairro.value = '';
            logradouro.value = '';
        } else {
            estado.value = retornoConvertido.uf;
            cidade.value = retornoConvertido.localidade;
            bairro.value = retornoConvertido.bairro;
            logradouro.value = retornoConvertido.logradouro;

            if (estado.value != '') {
                let prox = estado.nextElementSibling;

                if (prox.tagName == 'SPAN') {
                    prox.remove();
                }
            }

            if (cidade.value != '') {
                let prox = cidade.nextElementSibling;

                if (prox.tagName == 'SPAN') {
                    prox.remove();
                }
            }

            if (bairro.value != '') {
                let prox = bairro.nextElementSibling;

                if (prox.tagName == 'SPAN') {
                    prox.remove();
                }
            }

            if (logradouro.value != '') {
                let prox = logradouro.nextElementSibling;

                if (prox.tagName == 'SPAN') {
                    prox.remove();
                }
            }

            let prox = cep.nextElementSibling;

            if (prox.tagName == 'SPAN') {
                prox.remove();
            }
        }
    }

})

function avancar(indice) {
    carrossel.style.marginLeft = `-${indice}00%`;
}

function cadastrar() {
    aguardar();

    const dados = {
        nome: nome.value.trim(),
        cnpj: cnpj.value.trim(),
        nomeRepresentante: nomeRepresentante.value.trim(),
        emailRepresentante: emailRepresentante.value.trim(),
        senhaRepresentante: senhaRepresentante.value.trim(),
        endereco: {
            cep: cep.value.trim(),
            estado: estado.value.trim(),
            cidade: cidade.value.trim(),
            bairro: bairro.value.trim(),
            logradouro: logradouro.value.trim(),
        },
    };

    fetch("/empresas/cadastrar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                var divErrosLogin = document.getElementById("div_erros_login");
                divErrosLogin.style.backgroundColor = '#069006';

                finalizarAguardar("Cadastro realizado com sucesso! Redirecionando para tela de login...");

                setTimeout(() => {
                    window.location = "login.html";
                }, "2000");

            } else {
                finalizarAguardar("Houve um erro ao tentar realizar o cadastro!");
                throw "Houve um erro ao tentar realizar o cadastro!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
            finalizarAguardar(resposta);
        });
}