var setorModel = require("../models/setorModel")
var database = require("../database/config")

function buscarSetor(req, res) {
    var idEmpresa = req.body.id_empresa_server
    
    setorModel.buscarSetor(idEmpresa).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

function cadastrar(req, res) {
    var fk_empresa = req.body.empresa
    var nome = req.body.nome
    var descricao = req.body.descricao

    setorModel.cadastrar(fk_empresa, nome, descricao).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

async function excluir(req, res) {
    id = req.body.id
    empresa = req.body.empresa

    try{
        resultado = await setorModel.excluir(id, empresa);
        res.status(200).json(resultado)
    } catch(error){
            if(error.code == "ER_ROW_IS_REFERENCED_2"){
            res.status(400).send("Você tem parãmetros neste setor, delete eles para excluir");
        } else{
            res.status(400).send("Erro na exclusão");
        }
    }
}

function editar(req, res) {
    id = req.body.id
    nome = req.body.nome
    descricao = req.body.descricao
    empresa = req.body.empresa

    setorModel.editar(id, nome, descricao, empresa).then(function (resultado) {
        res.status(200).json(resultado)
    })
}

module.exports = {
    cadastrar,
    buscarSetor,
    excluir,
    editar
}