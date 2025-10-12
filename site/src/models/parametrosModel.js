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

function cadastrar(id_componente, valor, criticidade) {
    var sql = `INSERT INTO parametro(fk_componente, valor, criticidade) VALUES (${id_componente}, ${valor}, ${criticidade});`
    return database.executar(sql)
}

function excluir(id) {
    var sql = `DELETE FROM parametro WHERE id_parametro = ${id};` 
    return database.executar(sql)
}

function editar(idParametro, valor, criticidade) {
    var sql = `UPDATE parametro SET valor="${valor}", criticidade="${criticidade}" WHERE id_parametro=${idParametro};`
    return database.executar(sql)
}

module.exports = {
    buscarSetorParametro,
    buscarComponenteParametro,
    buscarParametro,
    cadastrar,
    excluir,
    editar
}