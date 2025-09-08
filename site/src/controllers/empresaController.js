var enderecoModel = require("../models/enderecoModel");
var empresaModel = require("../models/empresaModel");
var usuarioModel = require("../models/usuarioModel");
var database = require("../database/config");

function cadastrar(req, res) {
  //define variáveis vindas da requisição
  var {
    nome,
    cnpj,
    endereco,
    nomeRepresentante,
    emailRepresentante,
    senhaRepresentante
  } = req.body;
//Verifica se os dados estão completos
  if (!nome || !cnpj || !endereco
      || !nomeRepresentante || !emailRepresentante || !senhaRepresentante) {
    return res.status(400).json({
      mensagem:
        "Informe nome, cnpj, endereco e nome/email/senha do representante."
    });
  }

//Criando variáveis globais de ids criados pelo banco
  let idEnderecoCriado, idEmpresaCriada;

//1)Cadastrando Endereço (Primeiro passo)
  enderecoModel.cadastrarEndereco(
    endereco.estado,
    endereco.cidade,
    endereco.bairro,
    endereco.logradouro,
    endereco.cep
  )
  //Se o item 1) der certo, aloca no idEnderecoCriado(fk_endereco) o valor do ID usado para inserir o Endereço da empresa no BD
  .then(function(resultEnd) {
    idEnderecoCriado = resultEnd.insertId;
    //2)Cadastrando o nome cnpj e fk_endereco(idEnderecoCriado) na tabela Empresa
    return empresaModel.cadastrar(
      nome, cnpj, idEnderecoCriado
    );
  })
  //Se o item 2) der certo, aloca no idEmpresaCriada(fk_empresa) o valor do ID usado para inser a Empresa no BD
  .then(function(resultEmp) {
    idEmpresaCriada = resultEmp.insertId;

    //3)Cadastrando o usuário representante com todas as fks necessárias e valores vindos da req.body
    return  usuarioModel.cadastrarFuncionario(
      idEmpresaCriada,
      null,                  
      nomeRepresentante,
      emailRepresentante,
      senhaRepresentante,
      1
    );
  })
  //Se der certo o item 3) Devolve como status um json dos valores de id de insert no banco
  .then(function(resultRep) {
    res.status(201).json({
      idEmpresa:              idEmpresaCriada,
      idEndereco:             idEnderecoCriado,
      idUsuarioRepresentante: resultRep.insertId
    });
  })
  //Se der errado, apaga o registro de empresa, para não ficar vazia
  .catch(async function(err) {
    if (idEmpresaCriada) {
      await database.executar(
        `DELETE FROM empresa  WHERE id_empresa  = ${idEmpresaCriada}`
      );
    }
    //Se der errado, apaga o registro de endereco, para não ficar vazio
    if (idEnderecoCriado) {
      await database.executar(
        `DELETE FROM endereco WHERE id_endereco = ${idEnderecoCriado}`
      );
    }
    console.error("Erro no cadastro completo:", err);
    res.status(500).json({ mensagem: "Erro interno no cadastro." });
  });
}





function alterarStatus(req, res) {
  var idEmpresa = parseInt(req.params.id, 10);
  var novoStatus = req.body.status;

  if (!['PENDENTE', 'APROVADA', 'REPROVADA'].includes(novoStatus)) {
    return res.status(400).json({ mensagem: "Status inválido." });
  }


  empresaModel.buscarPorId(idEmpresa)
    .then(function (empresas) {
      if (empresas.length === 0) {
        res.status(404).json({ mensagem: "Empresa não encontrada." });
        throw { erroTratado: true };
      }

      return empresaModel.atualizarStatus(idEmpresa, novoStatus);
    })
    .then(function (resultadoUpdate) {

      if (resultadoUpdate.affectedRows === 0) {
        res.status(500).json({ mensagem: "Falha ao alterar status." });
        throw { erroTratado: true };
      }

      if (novoStatus === "APROVADA") {
          (function () {
            res.status(200).json({
              idEmpresa: idEmpresa,
              status: novoStatus,
              mensagem: "Empresa aprovada e representante criado."
            });
          });
      }
      res.status(200).json({ idEmpresa: idEmpresa, status: novoStatus });
    })
    .catch(function (err) {
      if (!err.erroTratado) {
        console.error("Erro ao alterar status:", err);
        res
          .status(500)
          .json({ mensagem: "Erro interno ao alterar status da empresa." });
      }
    });
}

function listar(req, res) {
  empresaModel.listarTodas()
    .then(empresas => res.status(200).json(empresas))
    .catch(err => {
      console.error("Erro ao listar empresas:", err);
      res.status(500).json({ mensagem: "Erro interno ao listar empresas." });
    });
}




module.exports = { cadastrar, alterarStatus, listar};