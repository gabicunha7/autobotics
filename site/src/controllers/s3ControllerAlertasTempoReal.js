// const AWS = require('aws-sdk');

// AWS.config.update({ region: process.env.AWS_REGION });
// const s3 = new AWS.S3();

// async function lerUltimoArquivo(req, res) {
//   try {
//     const params = {
//       Bucket: process.env.S3_BUCKET,
//       Prefix: "dashboard_alertas_tempo_real/jsons/"
//     };

//     let ContinuationToken = null;
//     let arquivos = [];

//     do {
//       const response = await s3.listObjectsV2({
//         ...params,
//         ContinuationToken
//       }).promise();


//       const objetosValidos = (response.Contents || []).filter(obj => !obj.Key.endsWith('/'));
//       arquivos = arquivos.concat(objetosValidos);

//       ContinuationToken = response.IsTruncated ? response.NextContinuationToken : null;

//     } while (ContinuationToken);

//     if (!arquivos.length) {
//       return res.status(404).json({ error: "Nenhum arquivo encontrado no bucket." });
//     }

//     const ultimoArquivo = arquivos.reduce((a, b) => 
//       new Date(a.LastModified) > new Date(b.LastModified) ? a : b
//     );

//     console.log(`Último arquivo encontrado: ${ultimoArquivo.Key}`);

//     const dadosClient = await s3.getObject({ 
//       Bucket: params.Bucket, 
//       Key: ultimoArquivo.Key 
//     }).promise();
    
//     const content = dadosClient.Body.toString("utf-8").trim();

//     res.json(JSON.parse(content));

//   } catch (err) {
//       console.error("Erro ao buscar arquivo:", err);
//       res.status(500).json({ 
//         error: "Erro ao buscar arquivo no S3", 
//         detalhe: err.message 
//       });
//   }
// }

// module.exports = {
//   lerUltimoArquivo
// };

const AWS = require('aws-sdk');
const { param } = require('../routes/s3RouteHistoricoAlerta');
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();

async function lerUltimoArquivo(req, res) {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Prefix: "dashboard_alertas_tempo_real/jsons/"
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
      Bucket: "testebucket-elt", 
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