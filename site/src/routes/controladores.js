var express = require("express");
var router = express.Router();

var funcionarioController = require("../controllers/controladoresController");

router.post("/cadastrar", function (req, res) {
    controladoresController.cadastrar(req, res);
});

router.post("/buscarSetor", function (req, res) {
    controladoresController.buscarSetor(req, res);
});

module.exports = router;