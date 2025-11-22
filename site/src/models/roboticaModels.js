var database = require("../database/config");


function buscarParametro(componente) {
    var sql = `SELECT * FROM parametro WHERE fk_componente = ${componente};`
    return database.executar(sql)
}

function buscarComponente(idControlador){
    var sql = ` SELECT cpu_percent, ram_usada_percent, disco_usado_percent, num_processos, top5_processos, timestamp FROM telemetria WHERE fk_controlador = ${idControlador} `;
    return database.executar(sql)
}


module.exports = {
    buscarParametro,
    buscarComponente
}