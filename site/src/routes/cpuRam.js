var express = require("express");
var router = express.Router();

var cpuRamController = require("../controllers/cpuRamController");

router.post("/buscarParametros", function (req, res) {
    cpuRamController.buscarParametros(req, res);
});

router.post("/buscarNomeSetor", function (req, res) {
    cpuRamController.buscarNomeSetor(req, res);
});

router.post("/buscarControladores", function (req, res) {
    cpuRamController.buscarControladores(req, res);
});

module.exports = router;