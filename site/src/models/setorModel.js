var database = require("../database/config");

function buscarSetor(idEmpresa) {
    var sql = `SELECT * FROM setor where fk_empresa = ${idEmpresa};`
    return database.executar(sql)
}

function cadastrar(fk_empresa, nome, descricao){
    var sql = `INSERT INTO setor (fk_empresa, nome, descricao) VALUES (${fk_empresa}, "${nome}", "${descricao}");`;
    return database.executar(sql)
}

async function excluir(id, empresa){
    try{
        var sql =`DELETE FROM componente WHERE fk_setor = ${id} and fk_empresa = ${empresa};`
        await database.executar(sql)
        var sql =`DELETE FROM controlador WHERE fk_setor = ${id} and fk_empresa = ${empresa};`
        await database.executar(sql)
        var sql = `DELETE FROM funcionario WHERE fk_setor = ${id} and fk_empresa = ${empresa};`
        await database.executar(sql)
        var sql = `DELETE FROM setor WHERE id_setor = ${id};`
        return await database.executar(sql)
    } catch(error){
        throw error;
    }
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