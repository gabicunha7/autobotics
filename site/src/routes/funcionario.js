var express = require("express");
var router = express.Router();

var funcionarioController = require("../controllers/funcionarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.post("/buscar", function (req, res) {
    funcionarioController.buscar(req, res);
});

router.get("/buscarCargos", function (req, res) {
    funcionarioController.buscarCargos(req, res);
})

router.post("/cadastrar", function (req, res) {
    funcionarioController.cadastrar(req, res);
});

router.post("/buscarSetor", function (req, res) {
    funcionarioController.buscarSetor(req, res);
});

router.post("/excluir", function (req, res) {
    funcionarioController.excluir(req, res);
})

router.post("/editar", function (req, res) {
    funcionarioController.editar(req, res);
})

module.exports = router;
