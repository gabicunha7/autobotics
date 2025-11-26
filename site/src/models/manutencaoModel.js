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

function totalAlertasNoSetor(setor){
    var sql = `SELECT COUNT(a.fk_controlador) AS total_alertas FROM alerta AS a
    INNER JOIN controlador AS c ON a.fk_controlador = c.id_controlador 
    INNER JOIN setor AS s ON c.fk_setor = s.id_setor
    WHERE a.criticidade IN (1, 2) AND s.id_setor = ${setor} AND date(a.timestamp) = DATE(NOW())
    GROUP BY s.nome;`
    return database.executar(sql)
}

module.exports = {
    buscarSetor,
    buscarSerial,
    buscarNomeSetor,
    buscarNomeControlador,
    totalAlertasNoSetor
}