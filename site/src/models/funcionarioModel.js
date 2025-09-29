var database = require("../database/config");

function buscar() {
    var sql = `SELECT * FROM funcionario;`
    return database.executar(sql)
}

function buscarCargos() {
    var sql = `SELECT * FROM cargo;`
    return database.executar(sql)
}

function cadastrar(nome, email, senha, setor, cargo, empresa) {
    var sql = `INSERT INTO funcionario(nome, email, senha_hash, fk_empresa, fk_setor, fk_cargo) VALUES("${nome}", "${email}", SHA2('${senha}', 256), ${empresa}, ${setor}, ${cargo});`
    return database.executar(sql)
}

function editar(id, nome, email, senha, setor, cargo, empresa) {
    var sql = `UPDATE funcionario SET nome="${nome}", email="${email}", senha_hash="${senha}", fk_setor=${setor}, fk_cargo=${cargo}, fk_empresa=${empresa} WHERE id_funcionario=${id};`
    return database.executar(sql)
}

function excluir(id) {
    var sql = `DELETE FROM funcionario WHERE id_funcionario = ` + id
    return database.executar(sql)
}

module.exports = {
    buscar,
    cadastrar,
    excluir,
    buscarCargos,
    editar
}