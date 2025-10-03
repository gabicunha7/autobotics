var database = require("../database/config");


function cadastrar(numero_serial, idempresa, idsetor) {
    var sql = `INSERT INTO controlador(numero_serial, fk_empresa, fk_setor) VALUES('${numero_serial}', ${idempresa}, ${idsetor});`
    return database.executar(sql)
}

function buscarControlador(idEmpresa) {
    var sql = `SELECT * FROM controlador where fk_empresa = ${idEmpresa};`
    return database.executar(sql)
}

function buscarSetor(empresa) {
    var sql = `SELECT * FROM setor WHERE fk_empresa = ${empresa};`
    return database.executar(sql)
}

module.exports = {
    cadastrar,
    buscarControlador,
    buscarSetor,
}