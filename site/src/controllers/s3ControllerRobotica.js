const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();


async function lerDadosHistoricoRobotica(req, res) {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET,
      Prefix: "dashboard_robotica-nrt/jsons/"
    };
    // permitir query params: controlador (serial ou id) e limite (n arquivos)
    const controlador = req.query.controlador || (req.body && req.body.controlador);
    const limite = parseInt(req.query.limite || (req.body && req.body.limite) || 6, 10);

    // listar objetos e ordenar por data desc
    const listaBuckets = await s3.listObjectsV2(params).promise();
    const contents = (listaBuckets.Contents || []).slice().sort((a,b) => b.LastModified - a.LastModified);

    if (!contents || contents.length === 0) {
      console.warn('Nenhum arquivo encontrado no S3 para prefixo', params.Prefix, 'bucket', params.Bucket);
      return res.json([]);
    }

    // Se não vier controlador, retornar conteúdo do arquivo mais recente (comportamento antigo)
    if (!controlador) {
      const ultimoArquivo = contents[0];
      console.log(`Último arquivo encontrado para histórico: ${ultimoArquivo.Key}`);
      const dadosClient = await s3.getObject({ Bucket: params.Bucket, Key: ultimoArquivo.Key }).promise();
      const text = dadosClient.Body.toString('utf-8').trim();
      let content;
      try { content = JSON.parse(text); } catch(e) { content = text; }
      // normalizar e retornar
      let resultado = [];
      if (Array.isArray(content)) {
        resultado = content.map(item => ({
          timestamp: item.timestamp || new Date().toISOString(),
          cpu_percent: item.cpu_percent !== undefined ? item.cpu_percent : (item.cpu !== undefined ? item.cpu : 0),
          ram_usada_percent: item.ram_usada_percent !== undefined ? item.ram_usada_percent : (item.ram !== undefined ? item.ram : 0),
          disco_usado_percent: item.disco_usado_percent !== undefined ? item.disco_usado_percent : (item.disk !== undefined ? item.disk : 0),
          disco_total_gb: item.disco_total_gb !== undefined ? item.disco_total_gb : (item.disk_total_gb || 0)
        }));
      } else if (content && typeof content === 'object') {
        resultado = [{
          timestamp: content.timestamp || new Date().toISOString(),
          cpu_percent: content.cpu_percent || content.cpu || 0,
          ram_usada_percent: content.ram_usada_percent || content.ram || 0,
          disco_usado_percent: content.disco_usado_percent || content.disk || 0,
          disco_total_gb: content.disco_total_gb || content.disk_total_gb || 0
        }];
      }
      return res.json(resultado);
    }

    // Quando controlador informado: primeiro tentar encontrar em cada arquivo
    // um nó com a chave do controlador (ex: { "0001": [...] }) que já contenha os 6 registros.
    const arquivos = contents.slice(0, limite);

    // normalize helper
    const firstNumber = (obj, keys) => {
      for (const k of keys) {
        if (obj[k] !== undefined && obj[k] !== null && obj[k] !== '') {
          const n = Number(obj[k]);
          if (!isNaN(n)) return n;
        }
      }
      return 0;
    };

    const normalizeRegistro = (registro, fallbackDate) => ({
      timestamp: registro.timestamp || registro.time || registro.ts || fallbackDate || new Date().toISOString(),
      cpu_percent: firstNumber(registro, ['cpu_percent', 'cpu', 'cpu_p', 'cpuPercent', 'cpu_percentaje', 'cpu_percentual']),
      ram_usada_percent: firstNumber(registro, ['ram_usada_percent', 'ramUsada', 'ram_usada', 'ram', 'ram_percent', 'ram_percentual', 'ramUsedPercent', 'memory_percent', 'memory', 'mem_percent', 'memory_percentual']),
      disco_usado_percent: firstNumber(registro, ['disco_usado_percent', 'discoUsado', 'disco_usado', 'disk', 'disk_used_percent', 'disk_percent', 'disco', 'disco_percent', 'diskUsedPercent']),
      disco_total_gb: firstNumber(registro, ['disco_total_gb', 'discoTotal', 'disco_total', 'disk_total_gb', 'disk_total', 'total_disk_gb'])
    });

    // procurar por arquivo que contenha content[controlador] estruturado
    for (const obj of arquivos) {
      try {
        const dataObj = await s3.getObject({ Bucket: params.Bucket, Key: obj.Key }).promise();
        const text = dataObj.Body.toString('utf-8').trim();
        let content;
        try { content = JSON.parse(text); } catch(e) { content = null; }
        if (!content) continue;

        if (content[controlador]) {
          const candidate = content[controlador];
          // se for array de registros, normalizar e retornar últimos `limite`
          if (Array.isArray(candidate)) {
            const norm = candidate.map(r => normalizeRegistro(r, obj.LastModified.toISOString()));
            // ordenar e limitar
            norm.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
            return res.json(norm.slice(-limite));
          }
          // se for um objeto com arrays paralelos (timestamps, cpu, ram, disco)
          if (candidate && typeof candidate === 'object') {
            const timestamps = Array.isArray(candidate.timestamps) ? candidate.timestamps : (Array.isArray(content.timestamps) ? content.timestamps : []);
            const cpuArr = Array.isArray(candidate.cpu) ? candidate.cpu : (Array.isArray(candidate.cpu_percent) ? candidate.cpu_percent : null);
            const ramArr = Array.isArray(candidate.ram) ? candidate.ram : (Array.isArray(candidate.ram_usada_percent) ? candidate.ram_usada_percent : null);
            const diskArr = Array.isArray(candidate.disco) ? candidate.disco : (Array.isArray(candidate.disk) ? candidate.disk : (Array.isArray(candidate.disco_usado_percent) ? candidate.disco_usado_percent : null));
            if (timestamps && timestamps.length) {
              const built = timestamps.map((ts, i) => normalizeRegistro({ timestamp: ts, cpu: cpuArr ? cpuArr[i] : undefined, ram: ramArr ? ramArr[i] : undefined, disk: diskArr ? diskArr[i] : undefined }, obj.LastModified.toISOString()));
              built.sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp));
              return res.json(built.slice(-limite));
            }
            // fallback: single object
            return res.json([normalizeRegistro(candidate, obj.LastModified.toISOString())]);
          }
        }
      } catch (e) {
        console.warn('Falha ao ler objeto S3', obj.Key, e);
      }
    }

    // Se não retornou ainda, usar comportamento antigo: varrer arquivos e procurar um registro por arquivo
    const resultados = [];
    for (const obj of arquivos.reverse()) { // reverse para ir do mais antigo ao mais novo
      try {
        const dataObj = await s3.getObject({ Bucket: params.Bucket, Key: obj.Key }).promise();
        const text = dataObj.Body.toString('utf-8').trim();
        let content;
        try { content = JSON.parse(text); } catch(e) { content = null; }

        if (!content) continue;

        let registro = null;
        if (Array.isArray(content)) {
          registro = content.find(r => {
            if (!r) return false;
            if (r.numero_serial && String(r.numero_serial) === String(controlador)) return true;
            if (r.serial && String(r.serial) === String(controlador)) return true;
            if (r.id_controlador && String(r.id_controlador) === String(controlador)) return true;
            if (r.fk_controlador && String(r.fk_controlador) === String(controlador)) return true;
            return false;
          }) || null;
        } else if (content && typeof content === 'object') {
          if (content[controlador]) {
            // se content[controlador] for um array, pegar o último registro
            const cand = content[controlador];
            if (Array.isArray(cand) && cand.length > 0) {
              registro = cand[cand.length - 1];
            } else if (cand && typeof cand === 'object') {
              registro = cand;
            }
          } else {
            const values = Object.values(content);
            for (const v of values) {
              if (v && typeof v === 'object') {
                if (v.numero_serial && String(v.numero_serial) === String(controlador)) { registro = v; break; }
                if (v.serial && String(v.serial) === String(controlador)) { registro = v; break; }
                if (v.id_controlador && String(v.id_controlador) === String(controlador)) { registro = v; break; }
              }
            }
          }
        }

        if (registro) {
          resultados.push(normalizeRegistro(registro, obj.LastModified.toISOString()));
        }
      } catch (e) {
        console.warn('Falha ao ler objeto S3', obj.Key, e);
      }
    }

    return res.json(resultados);
    } catch (err) {
      console.error('Erro ao buscar dados históricos:', err);
      // Retornar erro com json para facilitar debug no frontend
      res.status(500).json({ error: 'Erro ao buscar dados históricos', detail: String(err) });
    }
}

module.exports = {
  lerDadosHistoricoRobotica
};