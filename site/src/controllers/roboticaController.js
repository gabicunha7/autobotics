var telemetriaModel = require("../models/roboticaModels");

function buscarParametro(req, res) {
    var componente_server = req.body.componente;

    telemetriaModel.buscarParametro(componente_server)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar parâmetro:", erro);
            res.status(500).json(erro);
        });
}

function buscarComponente(req, res) {
    var idControlador_server = req.body.id_controlador;

    telemetriaModel.buscarComponente(idControlador_server)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar componente:", erro);
            res.status(500).json(erro);
        });
}

function buscarProcessos(req, res) {
    var idControlador_server = req.body.id_controlador;

    telemetriaModel.buscarProcessos(idControlador_server)
        .then(function (resultado) {
            try {
                if (resultado && resultado.length > 0) {
                    var raw = resultado[0].top5_processos;
                    var processos = [];
                    var ram_total_gb = resultado[0].ram_total_gb;

                    if (typeof raw === 'string') {
                        processos = JSON.parse(raw || '[]');
                    } else if (Array.isArray(raw)) {
                        processos = raw;
                    } else if (raw) {
                        
                        processos = JSON.parse(JSON.stringify(raw));
                    }

                    res.status(200).json({ processos: processos, ram_total_gb: ram_total_gb });
                } else {
                    res.status(200).json({ processos: [], ram_total_gb: null });
                }
            } catch (err) {
                console.log("Erro ao processar top5_processos:", err);
                res.status(500).json({ error: 'Falha ao processar dados dos processos' });
            }
        })
        .catch(function (erro) {
            console.log("Erro ao buscar processos:", erro);
            res.status(500).json(erro);
        });
}

function buscarControladoresPorSetor(req, res) {
    var idSetor_server = req.body.id_setor;

    telemetriaModel.buscarControladoresPorSetor(idSetor_server)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar controladores:", erro);
            res.status(500).json(erro);
        });
}

function buscarCriticidadeSetor(req, res) {
    var idSetor_server = req.body.id_setor;

    telemetriaModel.buscarCriticidadeSetor(idSetor_server)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar criticidade:", erro);
            res.status(500).json(erro);
        });
}

function buscarUltimosRegistrosTelemetria(req, res) {
    var idControlador_server = req.body.id_controlador;
    var limite = req.body.limite || 6;

    telemetriaModel.buscarUltimosRegistrosTelemetria(idControlador_server, limite)
        .then(function (resultado) {
            res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar últimos registros:", erro);
            res.status(500).json(erro);
        });
}

module.exports = {
    buscarParametro,
    buscarComponente,
    buscarProcessos,
    buscarControladoresPorSetor,
    buscarCriticidadeSetor,
    buscarUltimosRegistrosTelemetria
};