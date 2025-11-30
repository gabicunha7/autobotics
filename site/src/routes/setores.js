var express = require("express");
var router = express.Router();

var setoresController = require("../controllers/setoresController");

router.post("/buscarControladores", function (req, res) {
    setoresController.buscarControladores(req, res);
});

router.post("/buscarSetores", function (req, res) {
    setoresController.buscarSetores(req, res);
});

module.exports = router;