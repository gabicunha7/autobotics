var express = require("express");
var router = express.Router();

var historicoAlertaController = require("../controllers/historicoAlertaController");

router.post("/buscarSetor", function (req, res) {
    historicoAlertaController.buscarSetor(req, res);
});

router.post("/alertaSetorMesAtual", function (req, res) {
    historicoAlertaController.alertaSetorMesAtual(req, res);
});

router.post("/alertaSetorMesAnterior", function (req, res) {
    historicoAlertaController.alertaSetorMesAnterior(req, res);
});

router.post("/alertasPorMes", function (req, res) {
    historicoAlertaController.alertasPorMes(req, res);
});

router.post("/buscarSetoresComAlertasTotal", function (req, res) {
    historicoAlertaController.buscarSetoresComAlertasTotal(req, res);
});

router.post("/componenteComMaisAlertas", function (req, res) {
    historicoAlertaController.componenteComMaisAlertas(req, res);
});


module.exports = router;