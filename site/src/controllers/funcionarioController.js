var funcionarioModel = require("../models/funcionarioModel");
var database = require("../database/config");

function buscar(req, res) {
    funcionarioModel.buscar().then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function cadastrar(req, res) {
    nome = req.body.nome
    email = req.body.email
    senha = req.body.senha
    setor = req.body.setor
    empresa = req.body.empresa

    funcionarioModel.cadastrar(nome, email, senha, setor, empresa).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function excluir(req, res) {
    id = req.body.id
    funcionarioModel.excluir(id).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

module.exports = {
    buscar,
    cadastrar,
    excluir
}