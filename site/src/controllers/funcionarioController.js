var funcionarioModel = require("../models/funcionarioModel");
var database = require("../database/config");

function buscar(req, res) {
    id_empresa = req.body.id_empresa_server
    console.log("CONTROLLER:" , id_empresa);
    funcionarioModel.buscar(id_empresa).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function buscarCargos(req, res) {
    funcionarioModel.buscarCargos().then(function (resultado) {
        res.status(200).json(resultado)
    })
}

async function cadastrar(req, res) {
    nome = req.body.nome
    email = req.body.email
    senha = req.body.senha
    setor = req.body.setor
    cargo = req.body.cargo
    empresa = req.body.empresa

    try{
        await funcionarioModel.cadastrar(nome, email, senha, setor, cargo, empresa)
        .then(function (resultado) {
        res.status(200).json(resultado)
        })
    } catch(e){
        if(e.code == "ER_DUP_ENTRY"){
            res.status(400).send("E-mail já cadastrado");
        } else{
            res.status(400).send("Erro no cadastro");
        }
    }
}

function buscarSetor(req, res) {
    id_empresa_server = req.body.id_empresa
    

    funcionarioModel.buscarSetor(id_empresa_server).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

async function editar(req, res) {
    id = req.body.id
    nome = req.body.nome
    email = req.body.email
    senha = req.body.senha
    setor = req.body.setor
    cargo = req.body.cargo
    empresa = req.body.empresa
    try{
        await funcionarioModel.editar(id, nome, email, senha, setor, cargo, empresa)
        .then(function (resultado) {
        res.status(200).json(resultado)
        })
    } catch(e){
        if(e.code == "ER_DUP_ENTRY"){
            res.status(400).send("E-mail já cadastrado");
        } else{
            res.status(400).send("Erro ao editar");
        }
    }

}

function excluir(req, res) {
    id = req.body.id
    funcionarioModel.excluir(id).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

module.exports = {
    buscar,
    cadastrar,
    excluir,
    buscarCargos,
    buscarSetor,
    editar
}