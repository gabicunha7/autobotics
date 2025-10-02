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

router.post("/cadastrar", function (req, res) {
    parametrosController.cadastrar(req, res);
});

router.post("/excluir", function (req, res) {
    parametrosController.excluir(req, res);
})

router.post("/editar", function (req, res) {
    parametrosController.editar(req, res);
})

module.exports = router;
