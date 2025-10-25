var controladoresModel = require("../models/controladoresModel");
var database = require("../database/config");

async function cadastrar(req, res) {
    numero_serial = req.body.numero_serial
    idsetor = req.body.idsetor
    idempresa = req.body.idEmpresa
    
    try{
        await controladoresModel.cadastrar(numero_serial, idsetor, idempresa)
        .then(function (resultado) {
        res.status(200).json(resultado)
        })
    } catch(e){
        if(e.code == "ER_DUP_ENTRY"){
            res.status(400).send("Número serial já cadastrado");
            console.log("entrou no if")
        } else{
            res.status(400).send("Erro no cadastro");
            console.log(e)
        }
    }
}

function buscarControlador(req, res) {
    idEmpresa = req.body.id_empresa_server
    controladoresModel.buscarControlador(idEmpresa).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function excluir(req, res) {
    id = req.body.id
    controladoresModel.excluir(id).then(function (resultado) {
        res.status(200).json(resultado)
    })
}


function buscarSetor(req, res) {
    id_empresa_server = req.body.id_empresa

    controladoresModel.buscarSetor(id_empresa_server).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

async function editar(req, res) {
    id = req.body.id
    setor = req.body.setor
    empresa = req.body.empresa
    numero_serial = req.body.numero_serial

    try{
        await controladoresModel.editar(id, numero_serial, setor, empresa)
        .then(function (resultado) {
        res.status(200).json(resultado)
    })
    } catch(e){
        if(e.code == "ER_DUP_ENTRY"){
            res.status(400).send("Número serial já cadastrado");
        } else{
            res.status(400).send("Erro ao editar");
        }
    }
}

module.exports = {
    cadastrar,
    buscarSetor,
    buscarControlador,
    excluir,
    editar
}