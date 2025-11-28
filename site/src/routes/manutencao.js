var express = require("express");
var router = express.Router();

var manutencaoController = require("../controllers/manutencaoController");


router.post("/buscarSetor", function (req, res) {
    manutencaoController.buscarSetor(req, res);
});

router.post("/buscarSerial", function(req, res){
    manutencaoController.buscarSerial(req,res);
});

router.post("/buscarNomeSetor", function(req, res){
    manutencaoController.buscarNomeSetor(req,res);
});

router.post("/buscarNomeControlador", function(req, res){
    manutencaoController.buscarNomeControlador(req,res);
});

router.post("/totalAlertasNoSetor", function(req, res){
    manutencaoController.totalAlertasNoSetor(req,res);
});

router.post("/componenteComMaisAlertas", function(req, res){
    manutencaoController.componenteComMaisAlertas(req,res);
});

router.post("/topControladores", function(req, res){
    manutencaoController.topControladores(req,res);
});

router.post("/qtdAlertasPorNivelNaSemana", function(req, res){
    manutencaoController.qtdAlertasPorNivelNaSemana(req,res);
});


module.exports = router;