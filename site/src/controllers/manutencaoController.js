var manutencaoModel = require("../models/manutencaoModel");

function buscarSetor(req, res) {
    var empresa = req.body.empresa;

    manutencaoModel.buscarSetor(empresa)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar setores:", erro);
            res.status(500).json(erro);
        });
}

function buscarSerial(req, res) {
    var setor = req.body.setor;

    manutencaoModel.buscarSerial(setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar numero serial:", erro);
            res.status(500).json(erro);
        });
}

function buscarNomeSetor(req, res) {
    var setor = req.body.setor;

    manutencaoModel.buscarNomeSetor(setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar nome do setor:", erro);
            res.status(500).json(erro);
        });
}

function buscarNomeControlador(req, res) {
    var setor = req.body.setor;

    manutencaoModel.buscarNomeControlador(setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar nome do setor:", erro);
            res.status(500).json(erro);
        });
}



module.exports = {
    buscarSetor,
    buscarSerial,
    buscarNomeSetor,
    buscarNomeControlador
};