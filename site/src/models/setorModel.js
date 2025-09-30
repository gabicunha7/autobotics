var database = require("../database/config");

function buscarSetor() {
    var sql = `SELECT * FROM setor;`
    return database.executar(sql)
}

function cadastrar(fk_empresa, nome, descricao){
    var sql = `INSERT INTO setor (fk_empresa, nome, descricao) VALUES (${fk_empresa}, "${nome}", "${descricao}");`;
    return database.executar(sql)
}

function excluir(id, empresa){
    var sql =`DELETE FROM componente WHERE fk_setor = ${id} and fk_empresa = ${empresa};`
    database.executar(sql)
    var sql =`DELETE FROM controlador WHERE fk_setor = ${id} and fk_empresa = ${empresa};`
    database.executar(sql)
    var sql = `DELETE FROM funcionario WHERE fk_setor = ${id} and fk_empresa = ${empresa};`
    database.executar(sql)
    var sql = `DELETE FROM setor WHERE id_setor = ${id};`
    return database.executar(sql)
}

function editar(id, nome, descricao, empresa) {
    var sql = `UPDATE setor SET nome="${nome}", descricao="${descricao}" WHERE id_setor=${id} and fk_empresa=${empresa};`
    return database.executar(sql)
}

module.exports = {
    cadastrar,
    buscarSetor,
    excluir,
    editar
}