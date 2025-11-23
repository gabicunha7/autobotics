var express = require("express");
var router = express.Router();

var discoController = require("../controllers/discoController");


router.post("/buscarSetor", function (req, res) {
    discoController.buscarSetor(req, res);
});

router.post("/buscarSerial", function(req, res){
    discoController.buscarSerial(req,res);
});

router.post("/buscarAlertasSemana", function(req, res){
    discoController.buscarAlertasSemana(req,res);
});

router.post("/buscarQtdDiscosAlerta", function(req, res){
    discoController.buscarQtdDiscosAlerta(req,res);
});

module.exports = router;