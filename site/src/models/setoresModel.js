var database = require("../database/config");

function buscarControladores(setor, empresa) {
    var sql = `SELECT * FROM controlador as c 
                INNER JOIN telemetria as t ON c.id_controlador = t.fk_controlador 
                WHERE c.fk_setor = ${setor}
                ORDER BY t.cpu_percent DESC;`
    return database.executar(sql)
}

function buscarSetores(empresa) {
    var sql = `SELECT * FROM setor as s 
                INNER JOIN controlador as c ON s.id_setor = c.id_controlador
                INNER JOIN telemetria as t ON c.id_controlador = t.fk_controlador 
                WHERE s.fk_empresa = ${empresa}
                ORDER BY t.cpu_percent DESC;`
    return database.executar(sql)
}

module.exports = {
    buscarControladores,
    buscarSetores
}