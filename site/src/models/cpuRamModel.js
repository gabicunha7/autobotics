var database = require("../database/config");

function buscarParametros(setor, empresa) {
    var sql = `SELECT * FROM componente as c
                INNER JOIN parametro p ON c.id_componente = p.fk_componente
                WHERE fk_empresa = ${empresa} AND fk_setor = ${setor};`
    return database.executar(sql)
}

function buscarNomeSetor(setor) {
    var sql = `SELECT nome FROM setor WHERE id_setor = ${setor};`
    return database.executar(sql)
}

function buscarControladores(setor, empresa) {
    var sql = `SELECT * FROM controlador WHERE fk_setor = ${setor} AND fk_empresa = ${empresa};`
    return database.executar(sql)
}

module.exports = {
    buscarParametros,
    buscarNomeSetor,
    buscarControladores
}