var parametrosModel = require("../models/parametrosModel");
var database = require("../database/config");

function buscarSetorParametro(req, res) {
    id_empresa_server = req.body.id_empresa

    parametrosModel.buscarSetorParametro(id_empresa_server).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function buscarComponenteParametro(req, res) {
    id_empresa_server = req.body.id_empresa,
    id_setor_server = req.body.id_setor

    parametrosModel.buscarComponenteParametro(id_empresa_server, id_setor_server).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function buscarParametro(req, res) {
    id_componente_server = req.body.id_componente
    console.log("Testando o id",id_componente_server)
    parametrosModel.buscarParametro(id_componente_server).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function cadastrar(req, res) {
    id_componente = req.body.id_componente
    valor = req.body.valor
    criticidade = req.body.criticidade
    parametrosModel.cadastrar(id_componente, valor, criticidade).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function excluir(req, res) {
    id = req.body.id
    parametrosModel.excluir(id).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function editar(req, res) {
    idParametro = req.body.id_parametro
    valor = req.body.valor
    criticidade = req.body.criticidade
    

    parametrosModel.editar(idParametro, valor, criticidade).then(function (resultado) {
        res.status(200).json(resultado)
    })
}


module.exports = {
    buscarSetorParametro,
    buscarComponenteParametro,
    buscarParametro,
    cadastrar,
    excluir,
    editar
}