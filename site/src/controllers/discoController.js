var discoModel = require("../models/discoModel");

function buscarSetor(req, res) {
    var empresa = req.body.empresa;

    discoModel.buscarSetor(empresa)
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

    discoModel.buscarSerial(setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar numero serial:", erro);
            res.status(500).json(erro);
        });
}

function buscarAlertasSemana(req, res) {
    var setor = req.body.setor;

    discoModel.buscarAlertasSemana(setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar alertas na semana:", erro);
            res.status(500).json(erro);
        });
}


function buscarQtdDiscosAlerta(req, res) {
    var setor = req.body.setor;

    discoModel.buscarQtdDiscosAlerta(setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar qtd de alertas na semana:", erro);
            res.status(500).json(erro);
        });
}


function buscarCriticoSetor(req, res) {
    var setor = req.body.setor;

    discoModel.buscarCriticoSetor(setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar critico do setor:", erro);
            res.status(500).json(erro);
        });
}


module.exports = {
    buscarSetor,
    buscarSerial,
    buscarAlertasSemana,
    buscarQtdDiscosAlerta,
    buscarCriticoSetor
};