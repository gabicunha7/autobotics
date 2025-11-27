var database = require("../database/config");

function buscarSetor(empresa) {
    var sql = `SELECT * FROM setor WHERE fk_empresa = ${empresa};`
    return database.executar(sql)
}

function alertaSetorMesAtual(empresa, setor) {
    var sql = `
    SELECT
	COUNT(*) AS total_alertas
	FROM alerta AS a
	INNER JOIN controlador AS c 
    ON a.fk_controlador = c.id_controlador
    INNER JOIN setor as s
    ON c.fk_setor = s.id_setor AND c.fk_setor = ${setor}
	INNER JOIN empresa AS e
    ON c.fk_empresa = e.id_empresa AND c.fk_empresa = ${empresa}
	WHERE YEAR(a.timestamp) = YEAR(NOW())
	AND MONTH(a.timestamp) = MONTH(NOW());
    `

    return database.executar(sql)
}

function alertaSetorMesAnterior(empresa, setor){
    var sql = `
    SELECT
    COUNT(*) as qtd_alertas
	FROM alerta AS a
	INNER JOIN controlador AS c 
    ON a.fk_controlador = c.id_controlador
    INNER JOIN setor as s
    ON c.fk_setor = s.id_setor AND s.id_setor = ${setor}
    INNER JOIN empresa as e
    ON c.fk_empresa = e.id_empresa AND e.id_empresa = ${empresa}
	WHERE YEAR(a.timestamp) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH))
	AND MONTH(a.timestamp) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH));
    `

    return database.executar(sql)
}

function alertasPorMes(empresa, setor){
    var sql = `
    SELECT 
    SUM(CASE WHEN MONTH(a.timestamp) = 1  THEN 1 ELSE 0 END) AS Janeiro,
    SUM(CASE WHEN MONTH(a.timestamp) = 2  THEN 1 ELSE 0 END) AS Fevereiro,
    SUM(CASE WHEN MONTH(a.timestamp) = 3  THEN 1 ELSE 0 END) AS Março,
    SUM(CASE WHEN MONTH(a.timestamp) = 4  THEN 1 ELSE 0 END) AS Abril,
    SUM(CASE WHEN MONTH(a.timestamp) = 5  THEN 1 ELSE 0 END) AS Maio,
    SUM(CASE WHEN MONTH(a.timestamp) = 6  THEN 1 ELSE 0 END) AS Junho,
    SUM(CASE WHEN MONTH(a.timestamp) = 7  THEN 1 ELSE 0 END) AS Julho,
    SUM(CASE WHEN MONTH(a.timestamp) = 8  THEN 1 ELSE 0 END) AS Agosto,
    SUM(CASE WHEN MONTH(a.timestamp) = 9  THEN 1 ELSE 0 END) AS Setembro,
    SUM(CASE WHEN MONTH(a.timestamp) = 10 THEN 1 ELSE 0 END) AS Outubro,
    SUM(CASE WHEN MONTH(a.timestamp) = 11 THEN 1 ELSE 0 END) AS Novembro,
    SUM(CASE WHEN MONTH(a.timestamp) = 12 THEN 1 ELSE 0 END) AS Dezembro
FROM alerta a
INNER JOIN controlador c ON a.fk_controlador = c.id_controlador
INNER JOIN setor s ON c.fk_setor = s.id_setor
WHERE YEAR(a.timestamp) = YEAR(NOW())
  AND s.id_setor = ${setor}
  AND c.fk_empresa = ${empresa};
    `

    return database.executar(sql)
}

function buscarSetoresComAlertasTotal(empresa) {
    var sql = `
    SELECT 
        s.id_setor,
        s.nome,
        COUNT(a.id) AS total_alertas
    FROM setor s
    LEFT JOIN controlador c ON s.id_setor = c.fk_setor AND s.fk_empresa = c.fk_empresa
    LEFT JOIN alerta a ON c.id_controlador = a.fk_controlador
    WHERE s.fk_empresa = ${empresa}
    GROUP BY s.id_setor, s.nome
    ORDER BY total_alertas DESC;
    `

    return database.executar(sql)
}

function componenteComMaisAlertas(empresa, setor){
    var sql = `SELECT comp.nome AS componente_mais_alerta, COUNT(a.id) AS quantidade_de_alertas
        FROM alerta AS a 
        INNER JOIN controlador AS c ON a.fk_controlador = c.id_controlador
        INNER JOIN setor AS s ON c.fk_setor = s.id_setor
        INNER JOIN componente AS comp ON a.fk_componente = comp.id_componente 
        INNER JOIN empresa AS e ON c.fk_empresa = e.id_empresa
        WHERE YEAR(a.timestamp) = YEAR(NOW())
        AND MONTH(a.timestamp) = MONTH(NOW())
        AND s.id_setor = ${setor}
        AND e.id_empresa = ${empresa}
        GROUP BY comp.nome, comp.id_componente
        ORDER BY quantidade_de_alertas DESC
        LIMIT 1;`
        return database.executar(sql)
}

module.exports = {
    buscarSetor,
    alertaSetorMesAtual,
    alertaSetorMesAnterior,
    alertasPorMes,
    buscarSetoresComAlertasTotal,
    componenteComMaisAlertas
}