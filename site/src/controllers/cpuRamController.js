var cpuRamModel = require("../models/cpuRamModel");
var database = require("../database/config");

function buscarParametros(req, res) {
    var setor = req.body.setor;
    var empresa = req.body.empresa;

    cpuRamModel.buscarParametros(setor, empresa)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar parametros do setor " + setor + ": "+ erro);
            res.status(500).json(erro);
        });
}

function buscarNomeSetor(req, res) {
    var setor = req.body.setor;

    cpuRamModel.buscarNomeSetor(setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar parametros do setor " + setor + ": "+ erro);
            res.status(500).json(erro);
        });
}

function buscarControladores(req, res) {
    var setor = req.body.setor;
    var empresa = req.body.setor;

    cpuRamModel.buscarControladores(setor, empresa)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar controladores do setor " + setor + ": "+ erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    buscarParametros,
    buscarNomeSetor,
    buscarControladores
}