var historicoAlertaModel = require("../models/historicoAlertaModel");
var database = require("../database/config");

function buscarSetor(req, res) {
    var empresa = req.body.empresa;

    historicoAlertaModel.buscarSetor(empresa)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar setores:", erro);
            res.status(500).json(erro);
        });
}



function alertaSetorMesAtual(req, res) {

    var empresa = req.body.empresa;
    var setor = req.body.setor;
    console.log("empresa e setor" + empresa + setor)
    historicoAlertaModel.alertaSetorMesAtual(empresa, setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar alertas do setor no mês atual:", erro);
            res.status(500).json(erro);
        });
}

function alertaSetorMesAnterior(req, res) {
    var empresa = req.body.empresa;
    var setor = req.body.setor;

    historicoAlertaModel.alertaSetorMesAnterior(empresa, setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar alertas do setor no mês anterior:", erro);
            res.status(500).json(erro);
        });
}

function alertasPorMes(req, res) {
    var empresa = req.body.empresa;
    var setor = req.body.setor;
    console.log("Buscando alertas por mês - Empresa: " + empresa + " Setor: " + setor);

    historicoAlertaModel.alertasPorMes(empresa, setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar alertas por mês:", erro);
            res.status(500).json(erro);
        });
}

function buscarSetoresComAlertasTotal(req, res) {
    var empresa = req.body.empresa;
    console.log("Buscando setores com total de alertas - Empresa: " + empresa);

    historicoAlertaModel.buscarSetoresComAlertasTotal(empresa)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar setores com alertas:", erro);
            res.status(500).json(erro);
        });
}

function componenteComMaisAlertas(req, res) {
    var empresa = req.body.empresa;
    var setor = req.body.setor;
    console.log("Buscando componente com mais alertas - Empresa: " + empresa + " Setor: " + setor);

    historicoAlertaModel.componenteComMaisAlertas(empresa, setor)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar o componente com mais alertas no setor:", erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    buscarSetor,
    alertaSetorMesAtual,
    alertaSetorMesAnterior,
    alertasPorMes,
    buscarSetoresComAlertasTotal,
    componenteComMaisAlertas
}