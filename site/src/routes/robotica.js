var express = require("express");
var router = express.Router();

var roboticaController = require("../controllers/roboticaController");
const s3Controller = require('../controllers/s3ControllerRobotica');


router.post("/buscarParametro", function (req, res) {
    roboticaController.buscarParametro(req, res);
});

router.post("/buscarComponente", function(req, res){
    roboticaController.buscarComponente(req,res);
});

router.post("/buscarProcessos", function(req, res){
    roboticaController.buscarProcessos(req, res);
});

router.post("/buscarControladoresPorSetor", function(req, res){
    roboticaController.buscarControladoresPorSetor(req, res);
});

router.post("/buscarCriticidadeSetor", function(req, res){
    roboticaController.buscarCriticidadeSetor(req, res);
});

router.post("/buscarUltimosRegistrosTelemetria", function(req, res){
    roboticaController.buscarUltimosRegistrosTelemetria(req, res);
});

// Rota consolidada para dados históricos vindo do S3 (últimos N registros por controlador)
router.get('/dados/historico', function(req, res){
    s3Controller.lerDadosHistoricoRobotica(req, res);
});



module.exports = router;