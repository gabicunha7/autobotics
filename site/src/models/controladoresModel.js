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

function excluir(id) {
    var sql = `DELETE FROM controlador WHERE id_controlador = ` + id
    return database.executar(sql)
}

function editar(id, setor, numero_serial, empresa) {
    var sql = `UPDATE funcionario SET numero_serial="${numero_serial}", fk_setor=${setor}, fk_empresa=${empresa} WHERE id_controlador=${id};`
    return database.executar(sql)
}

module.exports = {
    cadastrar,
    buscarControlador,
    buscarSetor,
    excluir,
    editar
}