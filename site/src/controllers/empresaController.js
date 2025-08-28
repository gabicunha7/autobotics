// src/controllers/empresaController.js
var enderecoModel = require("../models/enderecoModel");
var empresaModel = require("../models/empresaModel");
var usuarioModel = require("../models/usuarioModel");


function cadastrar(req, res) {
  var { nome, cnpj, telefone, endereco } = req.body;
  if (!nome || !cnpj || !endereco) {
    return res.status(400).json({
      mensagem: "'nome', 'cnpj' e 'endereco' são obrigatórios."
    });
  }

  var idEnderecoCriado;

  empresaModel.buscarPorCnpj(cnpj)
    .then(function (achou) {
      if (achou.length > 0) {
        res.status(409).json({ mensagem: `CNPJ ${cnpj} já cadastrado.` });
        throw { erroTratado: true };
      }
      return enderecoModel.cadastrarEndereco(
        endereco.estado,
        endereco.cidade,
        endereco.bairro,
        endereco.logradouro,
        endereco.cep
      );
    })
    .then(function (resultadoEndereco) {
      idEnderecoCriado = resultadoEndereco.insertId;
      return empresaModel.cadastrar(
        nome,
        cnpj,
        telefone,
        idEnderecoCriado
      );
    })
    .then(function (resultadoEmpresa) {
      res.status(201).json({
        idEmpresa: resultadoEmpresa.insertId,
        nome,
        cnpj,
        telefone,
        endereco: {
          idEndereco: idEnderecoCriado,
          ...endereco
        }
      });
    })
    .catch(function (erro) {
      if (idEnderecoCriado && !erro.erroTratado) {
        database.executar(
          `DELETE FROM endereco WHERE id_endereco = ${idEnderecoCriado}`
        );
      }
      if (!erro.erroTratado) {
        console.error("Falha ao registrar empresa:", erro);
        res.status(500).json({ mensagem: "Erro interno ao cadastrar empresa." });
      }
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
        var nomeRep = req.body.nomeRepresentante;
        var emailRep = req.body.emailRepresentante;
        var senhaRep = req.body.senhaRepresentante;

        if (!nomeRep || !emailRep || !senhaRep) {
          res.status(400).json({
            mensagem:
              "Para aprovar, informe nomeRepresentante, emailRepresentante e senhaRepresentante."
          });
          throw { erroTratado: true };
        }

        return funcionarioModel.cadastrarFuncionario(
          idEmpresa,
          null,
          nomeRep,
          emailRep,
          senhaRep,
          null,
          null,
          'REPRESENTANTE'
        )
          .then(function (resultadoFuncionario) {
            res.status(200).json({
              idEmpresa: idEmpresa,
              status: novoStatus,
              idUsuarioRepresentante: resultadoFuncionario.insertId,
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



module.exports = { cadastrar, alterarStatus };