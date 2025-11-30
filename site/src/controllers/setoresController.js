var setoresModel = require("../models/setoresModel");
var database = require("../database/config");

function buscarControladores(req, res) {
    var setor = req.body.setor;
    var empresa = req.body.setor;

    setoresModel.buscarControladores(setor, empresa)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar controladores do setor " + setor + ": "+ erro);
            res.status(500).json(erro);
        });
}

function buscarSetores(req, res) {
    var empresa = req.body.empresa;

    setoresModel.buscarSetores(empresa)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar setores da empresa " + empresa + ": "+ erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    buscarControladores,
    buscarSetores
}