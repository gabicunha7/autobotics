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

router.post("/buscarNomeControlador", function(req, res){
    manutencaoController.buscarNomeControlador(req,res);
});

router.post("/totalAlertasNoSetor", function(req, res){
    manutencaoController.totalAlertasNoSetor(req,res);
});


module.exports = router;