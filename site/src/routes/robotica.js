var express = require("express");
var router = express.Router();

var roboticaController = require("../controllers/roboticaController");


router.post("/buscarParametro", function (req, res) {
    roboticaController.buscarParametro(req, res);
});

router.post("/buscarComponente", function(req, res){
    roboticaController.buscarComponente(req,res);
});



module.exports = router;