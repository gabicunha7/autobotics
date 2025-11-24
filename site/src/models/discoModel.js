var database = require("../database/config");


function buscarSetor(empresa) {
    var sql = `SELECT * FROM setor WHERE fk_empresa = ${empresa};`
    return database.executar(sql)
}

function buscarSerial(setor){
    var sql = `SELECT * FROM controlador WHERE fk_setor = ${setor} `;
    return database.executar(sql)
}

function buscarAlertasSemana(setor){
    var sql = `SELECT *
                from alerta a
                join controlador c on a.fk_controlador = c.id_controlador
                WHERE (select id_componente 
                from componente c
                where c.nome = "Disco"
                and fk_setor = ${setor}) = a.fk_componente 
                and c.fk_setor = ${setor}
                and a.timestamp between now() - interval 7 day and now()
                order by a.timestamp desc;
                `
    return database.executar(sql)
}

function buscarQtdDiscosAlerta(setor){
    var sql = `select count(*) contagem from (select numero_serial
                FROM alerta a
                JOIN controlador c ON a.fk_controlador = c.id_controlador
                WHERE (select id_componente 
                from componente c
                where c.nome = "Disco"
                and fk_setor = ${setor}) = a.fk_componente 
                and c.fk_setor = ${setor}
                AND a.timestamp between now() - INTERVAL 7 DAY and now()
                group by numero_serial) as alerta;  
                `
    return database.executar(sql)
}

function buscarCriticoSetor(setor){
    var sql = `select * from setor s
                inner join componente c
                    on c.fk_setor = s.id_setor
                inner join parametro p
                    on c.id_componente = p.fk_componente
                where s.id_setor = ${setor} and c.nome = "Disco"
                and criticidade = 2;
                `
    return database.executar(sql)
}


module.exports = {
    buscarSetor,
    buscarSerial,
    buscarAlertasSemana,
    buscarQtdDiscosAlerta,
    buscarCriticoSetor
}