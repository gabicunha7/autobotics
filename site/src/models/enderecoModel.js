var database = require("../database/config");


function cadastrarEndereco(estado, cidade, bairro, logradouro, cep) {
    var instrucaoSql = `
    INSERT INTO endereco
      (estado, cidade, bairro, logradouro, cep)
    VALUES
      ('${estado}', '${cidade}', '${bairro}', '${logradouro}', '${cep}')
  `;
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrarEndereco
};