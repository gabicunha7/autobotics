var express = require("express");
var router = express.Router();

var parametrosController = require("../controllers/parametrosController");

router.post("/buscarSetorParametro", function (req, res) {
    parametrosController.buscarSetorParametro(req, res);
});

router.post("/buscarComponenteParametro", function (req, res) {
    parametrosController.buscarComponenteParametro(req, res);
});

router.post("/buscarParametro", function (req, res) {
    parametrosController.buscarParametro(req, res);
});

module.exports = router;
