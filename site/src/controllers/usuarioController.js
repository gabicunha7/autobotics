var usuarioModel = require("../models/usuarioModel");


function login(req, res) {
    var email = req.body.email;
    var senha = req.body.senha;

    if (!email || !senha) {
        return res
            .status(400)
            .json({ mensagem: "'email' e 'senha' são obrigatórios." });
    }

    usuarioModel.buscarPorEmailComStatus(email, senha)
        .then(function (resultados) {
            if (resultados.length === 0) {
                res.status(401).json({ mensagem: "Credenciais inválidas." });
                throw { erroTratado: true };
                
            } else if ( resultados.length === 1){
                var usuario = resultados[0];

                if (usuario.status_empresa !== "APROVADA") {
                    res.status(403).json({
                        mensagem: "Empresa ainda não aprovada. Aguarde validação."
                    });
                    throw { erroTratado: true };
                }

                res.status(200).json({
                    idUsuario: usuario.id_funcionario,
                    nome: usuario.nome,
                    email: usuario.email,
                    cargo: usuario.fk_cargo,
                    empresa: usuario.fk_empresa,
                    setor: usuario.fk_setor,
                    ativo: usuario.ativo

                });
            } 
        })
        .catch(function (err) {
            if (!err.erroTratado) {
                console.error("Erro no login:", err);
                res.status(500).json({ mensagem: "Erro interno no login." });
            }
        });
}

module.exports = { login };
