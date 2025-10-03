var controladoresModel = require("../models/controladoresModel");
var database = require("../database/config");

function cadastrar(req, res) {
    numero_serial = req.body.numero_serial
    idsetor = req.body.idsetor
    idempresa = req.body.idEmpresa

    controladoresModel.cadastrar(numero_serial, idsetor, idempresa).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function buscarControlador(req, res) {
    idEmpresa = req.body.id_empresa_server
    console.log("Testando o id",idEmpresa)
    controladoresModel.buscarControlador(idEmpresa).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function buscarSetor(req, res) {
    id_empresa_server = req.body.id_empresa
    

    controladoresModel.buscarSetor(id_empresa_server).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

module.exports = {
    cadastrar,
    buscarSetor,
    buscarControlador,
}