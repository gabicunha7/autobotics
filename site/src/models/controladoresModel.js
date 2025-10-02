var database = require("../database/config");


function cadastrar(numero_serial, status) {
    var sql = `INSERT INTO controlador(numero_serial, status) VALUES("${numero_serial}", "ativo");`
    return database.executar(sql)
}


function buscarSetor(empresa) {
    var sql = `SELECT * FROM setor WHERE fk_empresa = ${empresa};`
    return database.executar(sql)
}

module.exports = {
    cadastrar,
    buscarSetor,
}