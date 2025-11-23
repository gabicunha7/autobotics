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

module.exports = {
    buscarSetor,
    buscarSerial
};