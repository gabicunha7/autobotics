var usuarioModel = require("../models/usuarioModel");


function login(req, res) {
    var email = req.body.email;
    var senha = req.body.senha;

    if (!email || !senha) {
        return res
            .status(400)
            .json({ mensagem: "'email' e 'senha' são obrigatórios." });
    }

    usuarioModel.buscarPorEmailComStatus(email)
        .then(function (resultados) {
            if (resultados.length === 0) {
                res.status(401).json({ mensagem: "Credenciais inválidas." });
                throw { erroTratado: true };
            }

            var usuario = resultados[0];


            if (usuario.status_empresa !== "APROVADA") {
                res.status(403).json({
                    mensagem: "Empresa ainda não aprovada. Aguarde validação."
                });
                throw { erroTratado: true };
            }

            // 2) Verifica senha (ainda sem hash)
            if (senha !== usuario.senha_hash) {
                res.status(401).json({ mensagem: "Credenciais inválidas." });
                throw { erroTratado: true };
            }

            // 3) Sucesso: retorna dados do usuário
            res.status(200).json({
                idUsuario: usuario.id_funcionario,
                nome: usuario.nome,
                email: usuario.email,
                perfil: usuario.nivel_de_acesso
            });
        })
        .catch(function (err) {
            if (!err.erroTratado) {
                console.error("Erro no login:", err);
                res.status(500).json({ mensagem: "Erro interno no login." });
            }
        });
}

module.exports = { login };
