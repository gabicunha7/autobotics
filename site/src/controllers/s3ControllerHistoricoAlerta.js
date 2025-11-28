const AWS = require('aws-sdk');
const { param } = require('../routes/s3RouteHistoricoAlerta');
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

async function lerUltimoArquivo(req, res) {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Prefix: "dashboard_historico_alerta/jsons/"
    };

    let ultimoArquivo = false;
    
    const listaBuckets = await s3.listObjectsV2(params).promise();

    for (let i = 0; i < (listaBuckets.Contents || []).length; i++) {
      const objetoAtualI = listaBuckets.Contents[i];
      if (!ultimoArquivo || objetoAtualI.LastModified > ultimoArquivo.LastModified) {
        ultimoArquivo = objetoAtualI; 
      }
    }

    if (!ultimoArquivo) {
      return res.status(404).json({ error: "arquivo não foi encontrado." });
    }

    console.log(`Último arquivo encontrado: ${ultimoArquivo.Key}`);

    const dadosClient = await s3.getObject({ 
      Bucket: params.Bucket, 
      Key: ultimoArquivo.Key 
    }).promise();
    
    const text = dadosClient.Body.toString("utf-8").trim();

    let content;
    if (text.startsWith("{") || text.startsWith("[")) {
      content = JSON.parse(text);
    } else {
      content = text;
    }

    res.json(content);
  } catch (err) {
      console.error('Erro ao buscar arquivo:', err.message);
      res.status(500).send('Erro ao buscar arquivo: ' + err.message);
  }
}


module.exports = {
  lerUltimoArquivo
};