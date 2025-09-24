var database = require("../database/config");

function buscar() {
    var sql = `SELECT * FROM funcionario`;
    return database.executar(sql)
}

function cadastrar(nome, email, senha, setor) {
    var sql = `INSERT INTO funcionario (${nome}, ${email}, ${senha}, 1, ${setor}, 1, null, 1, null)`
    return database.executar(sql)
}

function excluir(id) {
    var sql = `DELETE FROM funcionario WHERE id_funcionario = ` + id
    return database.executar(sql)
}

module.exports = {
    buscar,
    cadastrar,
    excluir
}