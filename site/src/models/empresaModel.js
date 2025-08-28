var database = require("../database/config");


function cadastrar(nome, cnpj, telefone, fk_endereco) {
  var instrucao = `
    INSERT INTO empresa
      (nome, cnpj, telefone, fk_endereco)
    VALUES
      ('${nome}', '${cnpj}', '${telefone}', ${fk_endereco})
  `;
  return database.executar(instrucao);
}

function buscarPorCnpj(cnpj) {
  var instrucao = `SELECT * FROM empresa WHERE cnpj = '${cnpj}'`;
  return database.executar(instrucao);
}


function atualizarStatus(idEmpresa, novoStatus) {
  var instrucao = `
    UPDATE empresa
      SET status = '${novoStatus}'
    WHERE id_empresa = ${idEmpresa}
  `;
  return database.executar(instrucao);
}


function buscarPorId(idEmpresa) {
  var instrucao = `SELECT * FROM empresa WHERE id_empresa = ${idEmpresa}`;
  return database.executar(instrucao);
}

module.exports = {
  buscarPorId,
  buscarPorCnpj,
  cadastrar,
  atualizarStatus
};
