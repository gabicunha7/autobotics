var telemetriaModel = require("../models/roboticaModels");

function buscarParametro(req, res) {
    var componente_server = req.body.componente;

    telemetriaModel.buscarParametro(componente_server)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar parâmetro:", erro);
            res.status(500).json(erro);
        });
}

function buscarComponente(req, res) {
    var idControlador_server = req.body.id_controlador;

    telemetriaModel.buscarComponente(idControlador_server)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar componente:", erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    buscarParametro,
    buscarComponente
};