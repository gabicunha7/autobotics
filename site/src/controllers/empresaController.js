var enderecoModel = require("../models/enderecoModel");
var empresaModel = require("../models/empresaModel");
var usuarioModel = require("../models/usuarioModel");
var database = require("../database/config");

function cadastrar(req, res) {
    var {
        nome,
        cnpj,
        endereco,
        nomeRepresentante,
        emailRepresentante,
        senhaRepresentante
    } = req.body;

    if (!nome || !cnpj || !endereco
        || !nomeRepresentante || !emailRepresentante || !senhaRepresentante) {
        return res.status(400).json({
            mensagem:
                "Informe nome, cnpj, endereco e nome/email/senha do representante."
        });
    }

    let idEnderecoCriado, idEmpresaCriada;

    enderecoModel.cadastrarEndereco(
        endereco.estado,
        endereco.cidade,
        endereco.bairro,
        endereco.logradouro,
        endereco.cep
    )
        .then(function (resultEnd) {
            idEnderecoCriado = resultEnd.insertId;

            return empresaModel.cadastrar(
                nome, cnpj, idEnderecoCriado
            );
        })
        .then(function (resultEmp) {
            idEmpresaCriada = resultEmp.insertId;


            return usuarioModel.cadastrarFuncionario(
                idEmpresaCriada,
                null,
                nomeRepresentante,
                emailRepresentante,
                senhaRepresentante,
                1
            );
        })
        .then(function (resultRep) {
            res.status(201).json({
                idEmpresa: idEmpresaCriada,
                idEndereco: idEnderecoCriado,
                idUsuarioRepresentante: resultRep.insertId
            });
        })
        .catch(function (err) {
            if (idEmpresaCriada) {
                database.executar(
                    `DELETE FROM empresa  WHERE id_empresa  = ${idEmpresaCriada}`
                );
            }
            if (idEnderecoCriado) {
                database.executar(
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

                return usuarioModel.cadastrarFuncionario(
                    idEmpresa,
                    null,
                    nomeRep,
                    emailRep,
                    senhaRep,
                    1
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

function listar(req, res) {
    empresaModel.listarTodas()
        .then(empresas => res.status(200).json(empresas))
        .catch(err => {
            console.error("Erro ao listar empresas:", err);
            res.status(500).json({ mensagem: "Erro interno ao listar empresas." });
        });
}




module.exports = { cadastrar, alterarStatus, listar };