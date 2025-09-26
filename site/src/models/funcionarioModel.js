var database = require("../database/config");

function buscar() {
    var sql = `SELECT * FROM funcionario;`
    return database.executar(sql)
}

function cadastrar(nome, email, senha, setor, empresa) {
    var sql = `INSERT INTO funcionario(nome, email, senha_hash, fk_empresa, fk_setor, fk_cargo) VALUES("${nome}", "${email}", SHA2('${senha}', 256), ${empresa}, ${setor}, 1);`
    return database.executar(sql)
}

function excluir(id) {
    var sql = `DELETE FROM funcionario WHERE id_funcionario = ` + id
    return database.executar(sql)
}

module.exports = {
    buscar,
    cadastrar,
    excluir
}