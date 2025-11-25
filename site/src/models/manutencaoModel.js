var database = require("../database/config");


function buscarSetor(empresa) {
    var sql = `SELECT * FROM setor WHERE fk_empresa = ${empresa};`
    return database.executar(sql)
}

function buscarSerial(setor){
    var sql = `SELECT * FROM controlador WHERE fk_setor = ${setor} `;
    return database.executar(sql)
}

function buscarNomeSetor(setor){
    var sql = `SELECT nome FROM setor WHERE id_setor = ${setor} `;
    return database.executar(sql)
}

function buscarNomeControlador(controlador){
    var sql = `SELECT numero_serial FROM controlador WHERE id_controlador = ${controlador} `;
    return database.executar(sql)
}

module.exports = {
    buscarSetor,
    buscarSerial,
    buscarNomeSetor,
    buscarNomeControlador
}