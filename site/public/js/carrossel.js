const carrossel = document.querySelector('.carrossel-cadastro');

let nome = document.querySelector('#nome_empresa');
let cnpj = document.querySelector('#cnpj');

function validarEmpresa() {
    let erros = 0;

    if (nome.value.length < 2) {
        let prox = nome.nextElementSibling;
        
        if (prox.tagName != 'SPAN') {
            let span = document.createElement('span');
            span.classList.add('erro');
            span.textContent = "O nome deve conter pelo menos 2 caracteres";

            nome.insertAdjacentElement('afterend', span);
        }

        erros += 1;
    } else {
        let prox = nome.nextElementSibling;

        if (prox.tagName == 'SPAN') {
            prox.remove();
        }
    }
    
    if (cnpj.value.length != 18) {
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
    
    if (erros == 0) {
        avancar(1)
    }

}


cnpj.addEventListener("input", function(){
    let limparValor = cnpj.value.replace(/\D/g, "").substring(0, 14);

    let numerosArray = limparValor.split("");

    let numeroFormatado = "";

    if(numerosArray.length > 0){
        numeroFormatado += `${numerosArray.slice(0,2).join("")}`;
    }

    if(numerosArray.length > 2){
        numeroFormatado += `.${numerosArray.slice(2,5).join("")}`;
    }

    if(numerosArray.length > 5){
        numeroFormatado += `.${numerosArray.slice(5,8).join("")}`;
    }

    if(numerosArray.length > 8){
        numeroFormatado += `/${numerosArray.slice(8,12).join("")}`;
    }

    if(numerosArray.length > 12){
        numeroFormatado += `-${numerosArray.slice(12,14).join("")}`;
    }

    cnpj.value = numeroFormatado;
});

function avancar(indice) {
    carrossel.style.marginLeft = `-${indice}00%`;
}