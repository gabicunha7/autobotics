var database = require("../database/config");

function buscarControladores(setor, empresa) {
    var sql = `SELECT * FROM controlador as c 
                INNER JOIN telemetria as t ON c.id_controlador = t.fk_controlador 
                WHERE c.fk_setor = ${setor}
                ORDER BY t.cpu_percent DESC;`
    return database.executar(sql)
}

function buscarSetores(empresa) {
    var sql = `SELECT s.id_setor, s.nome, COUNT(a.id) AS total_alertas
                FROM setor AS s
                LEFT JOIN controlador AS c ON s.id_setor = c.fk_setor
                LEFT JOIN alerta AS a ON a.fk_controlador = c.id_controlador
                WHERE s.fk_empresa = ${empresa}
                GROUP BY s.id_setor 
                ORDER BY total_alertas DESC; `
    return database.executar(sql)
}

module.exports = {
    buscarControladores,
    buscarSetores
}