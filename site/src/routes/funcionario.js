var express = require("express");
var router = express.Router();

var funcionarioController = require("../controllers/funcionarioController");

//Recebendo os dados do html e direcionando para a função cadastrar de usuarioController.js
router.get("/buscar", function (req, res) {
    funcionarioController.buscar(req, res);
});

router.post("/cadastrar", function (req, res) {
    funcionarioController.cadastrar(req, res);
});

router.post("/excluir", function (req, res) {
    funcionarioController.excluir(req, res);
})

module.exports = router;
