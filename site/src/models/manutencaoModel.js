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

function componenteComMaisAlertas(setor){
    var sql = `SELECT comp.nome AS componente_mais_alerta, COUNT(a.fk_componente) AS quantidade_de_alertas
        FROM alerta AS a INNER JOIN controlador AS c ON a.fk_controlador = c.id_controlador
        INNER JOIN setor AS s ON c.fk_setor = s.id_setor
        INNER JOIN componente AS comp ON a.fk_componente = comp.id_componente 
        WHERE DATE(a.timestamp) = DATE(NOW())
        AND s.id_setor = ${setor}
        GROUP BY comp.nome, comp.id_componente
        ORDER BY quantidade_de_alertas DESC
        LIMIT 1;`
        return database.executar(sql)
}

function topControladores(setor){
    var sql = ` SELECT c.numero_serial AS nome_controlador, COUNT(a.fk_controlador) AS quantidade_alertas
        FROM alerta AS a 
        INNER JOIN controlador AS c ON a.fk_controlador = c.id_controlador
        INNER JOIN setor AS s on c.fk_setor = s.id_setor
        WHERE DATE(a.timestamp) = DATE(NOW()) AND s.id_setor = ${setor}
        GROUP BY c.numero_serial, c.id_controlador ORDER BY quantidade_alertas DESC
        LIMIT 5;
    `
    return database.executar(sql)
}

function qtdAlertasPorNivelNaSemana(controlador){
    var sql = `SELECT
    c.numero_serial AS nome_controlador,
    DATE(a.timestamp) AS data_alerta,
    SUM(CASE WHEN a.criticidade = 1 THEN 1 ELSE 0 END) AS qtd_nivel_medio,
    SUM(CASE WHEN a.criticidade = 2 THEN 1 ELSE 0 END) AS qtd_nivel_critico
    FROM
        alerta AS a
    INNER JOIN
        controlador AS c ON a.fk_controlador = c.id_controlador
    WHERE
        a.timestamp BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()
        AND c.id_controlador = ${controlador} 
    GROUP BY
        c.numero_serial,
        c.id_controlador,
        data_alerta
    ORDER BY
        data_alerta,
        c.numero_serial;
    `
    return database.executar(sql)
}

module.exports = {
    buscarSetor,
    buscarSerial,
    buscarNomeSetor,
    buscarNomeControlador,
    totalAlertasNoSetor,
    componenteComMaisAlertas,
    topControladores,
    qtdAlertasPorNivelNaSemana
}