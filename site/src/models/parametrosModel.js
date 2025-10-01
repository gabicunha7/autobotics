var database = require("../database/config");

function buscarSetorParametro(empresa) {
    var sql = `SELECT * FROM setor WHERE fk_empresa = ${empresa};`
    return database.executar(sql)
}

function buscarComponenteParametro(empresa, setor) {
    var sql = `SELECT * FROM componente WHERE fk_empresa = ${empresa} AND fk_setor = ${setor};`
    return database.executar(sql)
}

function buscarParametro(componente) {
    var sql = `SELECT * FROM parametro WHERE fk_componente = ${componente};`
    return database.executar(sql)
}

module.exports = {
    buscarSetorParametro,
    buscarComponenteParametro,
    buscarParametro
}