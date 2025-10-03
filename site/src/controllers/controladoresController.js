var funcionarioModel = require("../models/controladoresModel");
var database = require("../database/config");

function cadastrar(req, res) {
    numero_serial = req.body.numeroserial

    controladoresModel.cadastrar(numero_serial).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function buscarSetor(req, res) {
    id_empresa_server = req.body.id_empresa
    

    funcionarioModel.buscarSetor(id_empresa_server).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

module.exports = {
    cadastrar,
    buscarSetor,
}