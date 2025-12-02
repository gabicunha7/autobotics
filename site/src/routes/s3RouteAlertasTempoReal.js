const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');

// Configuração AWS
AWS.config.update({
    region: 'us-east-1'
});

const s3 = new AWS.S3();
const BUCKET = 'client-1d4a3f130793f4b0dfc576791dd86b32';
const PASTA = 'dashboard_alertas_tempo_real/jsons/';

const s3Controller = require('../controllers/s3ControllerAlertasTempoReal');

// Função auxiliar para transformar os alertas em dados para o heatmap
// function prepararHeatmap(alertas) {
//     // Exemplo de transformação:
//     // Agrupa por controlador e pega os últimos 12 registros
//     const setores = {};

//     alertas.forEach(alerta => {
//         const setor = alerta.Descricao.Setor;
//         const maquina = alerta.Descricao.Maquina;
//         const key = `${setor} - ${maquina}`;

//         if (!setores[key]) setores[key] = [];

//         // Mantém no máximo os últimos 12 registros
//         setores[key].push({
//             componente: alerta.Descricao.Componente,
//             valor: parseFloat(alerta.Descricao.ValorAtual),
//             criticidade: alerta.Descricao.Criticidade
//         });

//         if (setores[key].length > 12) setores[key].shift();
//     });

//     return setores;
// }

// Rota principal
// router.get('/dados/ultimo', async (req, res) => {
//     try {
//         // Lista objetos
//         const lista = await s3.listObjectsV2({
//             Bucket: BUCKET,
//             Prefix: PASTA
//         }).promise();

//         if (!lista.Contents || lista.Contents.length === 0) {
//             return res.status(404).json({ erro: 'Nenhum arquivo encontrado.' });
//         }

//         // Último arquivo modificado
//         const ultimoArquivo = lista.Contents.sort((a, b) => b.LastModified - a.LastModified)[0].Key;

//         // Obtem conteúdo
//         const dados = await s3.getObject({
//             Bucket: BUCKET,
//             Key: ultimoArquivo
//         }).promise();

//         console.log("JSON: ", dados);
        

//         const jsonAlertas = JSON.parse(dados);

//         res.json(jsonAlertas);
//     } catch (err) {
//         console.error('Erro ao buscar arquivo:', err);
//         res.status(500).json({ erro: 'Erro ao buscar alertas do S3' });
//     }
// });

router.get('/dados/ultimo', (req, res) => {
  s3Controller.lerUltimoArquivo(req, res);
});

module.exports = router;
