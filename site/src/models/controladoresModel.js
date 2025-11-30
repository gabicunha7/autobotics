var database = require("../database/config");


function cadastrar(numero_serial, idempresa, idsetor) {
    var sql = `INSERT INTO controlador(numero_serial, fk_setor, fk_empresa) VALUES('${numero_serial}', ${idempresa}, ${idsetor});`
    return database.executar(sql)
}

function buscarControlador(idEmpresa) {
    var sql = `SELECT numero_serial, id_controlador, 
                status, s.nome
                FROM controlador c
                left join setor s
                on c.fk_setor = s.id_setor
                where c.fk_empresa = ${idEmpresa};`
    return database.executar(sql)
}

function buscarSetor(empresa) {
    var sql = `SELECT * FROM setor WHERE fk_empresa = ${empresa};`
    return database.executar(sql)
}

async function excluir(id) {
    var sql = `DELETE FROM telemetria WHERE fk_controlador = ${id};`
    await database.executar(sql)
    var sql = `DELETE FROM controlador WHERE id_controlador = ` + id
    return database.executar(sql)
}

function editar(id,numero_serial, setor, empresa) {
    var sql = `UPDATE controlador SET numero_serial="${numero_serial}", fk_setor= ${setor}, fk_empresa=${empresa} WHERE id_controlador=${id};`
    return database.executar(sql)
}

function listarPorSetor(nomeSetor, idEmpresa) {
    const sql = `
        SELECT 
            c.id_controlador,
            c.numero_serial,
            c.status,
            s.nome AS setor
        FROM controlador c
        JOIN setor s ON c.fk_setor = s.id_setor
        WHERE s.nome = '${nomeSetor}'
        AND c.fk_empresa = ${idEmpresa};
    `;
    return database.executar(sql);
}


module.exports = {
    cadastrar,
    buscarControlador,
    buscarSetor,
    excluir,
    editar,
    listarPorSetor
}