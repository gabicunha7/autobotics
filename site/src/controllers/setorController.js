var setorModel = require("../models/setorModel")
var database = require("../database/config")

function buscarSetor(req, res) {
    setorModel.buscarSetor().then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function cadastrar(req, res) {
    var fk_empresa = req.body.empresa
    var nome = req.body.nome
    var descricao = req.body.descricao

    setorModel.cadastrar(fk_empresa, nome, descricao).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function excluir(req, res) {
    id = req.body.id
    empresa = req.body.empresa
    setorModel.excluir(id, empresa).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function editar(req, res) {
    id = req.body.id
    nome = req.body.nome
    descricao = req.body.descricao
    empresa = req.body.empresa

    setorModel.editar(id, nome, descricao, empresa).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

module.exports = {
    cadastrar,
    buscarSetor,
    excluir,
    editar
}