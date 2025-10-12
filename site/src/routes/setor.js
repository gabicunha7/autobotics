var express = require("express");
var router = express.Router();

var setorController = require("../controllers/setorController");

router.post("/cadastrar", function (req, res) {
    setorController.cadastrar(req, res);
});

router.post("/buscarSetor", function (req, res) {
    setorController.buscarSetor(req, res);
})

router.post("/excluir", function (req, res){
    setorController.excluir(req, res)
})

router.post("/editar", function (req, res) {
    setorController.editar(req, res);
})

module.exports = router;