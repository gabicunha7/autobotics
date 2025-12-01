var database = require("../database/config");


function buscarParametro(componente) {
    var sql = `SELECT * FROM parametro WHERE fk_componente = ${componente};`
    return database.executar(sql)
}

function buscarComponente(idControlador){
  var sql = `
    SELECT 
      cpu_percent, 
      ram_usada_percent, 
      ram_total_gb, 
      disco_usado_percent, 
      disco_total_gb 
    FROM telemetria 
    WHERE fk_controlador = ${idControlador} 
    ORDER BY timestamp DESC 
    LIMIT 1;
  `;
  return database.executar(sql);
}


function buscarProcessos(idControlador){
    var sql = `SELECT top5_processos, ram_total_gb FROM telemetria WHERE fk_controlador = ${idControlador} ORDER BY timestamp DESC LIMIT 1;`
    return database.executar(sql)
}

// Buscar controladores disponíveis em um setor
function buscarControladoresPorSetor(idSetor){
    var sql = `SELECT id_controlador, numero_serial FROM controlador WHERE fk_setor = ${idSetor} ORDER BY numero_serial ASC;`
    return database.executar(sql)
}

// Buscar criticidade (limiares) dos componentes de um setor
// Retorna: valor para criticidade 1 (média) e criticidade 2 (crítica)
function buscarCriticidadeSetor(idSetor){
    var sql = `SELECT DISTINCT c.id_componente, c.nome, 
               MAX(CASE WHEN p.criticidade = 1 THEN p.valor END) as limiar_medio,
               MAX(CASE WHEN p.criticidade = 2 THEN p.valor END) as limiar_critico
               FROM componente c
               LEFT JOIN parametro p ON c.id_componente = p.fk_componente
               WHERE c.fk_setor = ${idSetor}
               GROUP BY c.id_componente, c.nome
               LIMIT 3;`
    return database.executar(sql)
}

// Buscar últimos 6 registros de telemetria de um controlador
function buscarUltimosRegistrosTelemetria(idControlador, limite = 6){
    var sql = `SELECT cpu_percent, ram_usada_percent, disco_usado_percent, disco_total_gb, timestamp 
               FROM telemetria 
               WHERE fk_controlador = ${idControlador} 
               ORDER BY timestamp DESC 
               LIMIT ${limite};`
    return database.executar(sql)
}

module.exports = {
    buscarParametro,
    buscarComponente,
    buscarProcessos,
    buscarControladoresPorSetor,
    buscarCriticidadeSetor,
    buscarUltimosRegistrosTelemetria
}