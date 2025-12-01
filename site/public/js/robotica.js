window.onload = function() {
    chartCPU = criarGrafico("grafico_cpu", "CPU", 0, "green", "cpu");
    chartRAM = criarGrafico("grafico_ram", "RAM", 0, "orange", "ram");
    chartDISCO = criarGrafico("grafico_disco", "Disco", 0, "red", "disco");

    // Recuperar controlador e setor da sessão
    var idControlador = sessionStorage.CONTROLADOR;
    var idSetor = sessionStorage.SETOR_USUARIO;

    console.log('Dashboard carregada com ID_CONTROLADOR:', idControlador, 'ID_SETOR:', idSetor);

    // Carregar lista de controladores do setor e popular select
    carregarControladoresSetor(idSetor, idControlador);

    carregarTelemetria(idControlador);
    setInterval(() => carregarTelemetria(idControlador), 4000);

    carregarTop5Processos(idControlador);
    setInterval(() => carregarTop5Processos(idControlador), 4000);

    carregarCriticidadeSetor(idSetor);
    carregarUltimosRegistrosTelemetria(idControlador);
    setInterval(() => carregarUltimosRegistrosTelemetria(idControlador), 10000);

    carregarDadosHistoricoS3();
    setInterval(() => carregarDadosHistoricoS3(), 10000);
};

function carregarTelemetria(idControlador) {
  fetch("/robotica/buscarComponente", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
    id_controlador: idControlador
})
  })
  .then(res => res.json())
  .then(data => {
    if (data && data.length > 0) {
        atualizarGraficos(data[0]);
    }
})
  .catch(err => console.error(err));
}

// Reuse carregarTelemetria to also fetch top5 processos and render table
function carregarTop5Processos(idControlador){
    fetch('/robotica/buscarProcessos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_controlador: idControlador })
    })
    .then(res => res.json())
    .then(procData => {
    // suporte ao novo formato { processos: [...], ram_total_gb: <num> }
    if (!procData) {
      top5Processos([], null);
      return;
    }

    var processos = procData.processos || procData;
    var ram_total_gb = procData.ram_total_gb || null;
    var totalRamBytes = null;
    if (ram_total_gb !== null && ram_total_gb !== undefined) {
      totalRamBytes = Number(ram_total_gb) * 1024 * 1024 * 1024;
    }

    top5Processos(processos, totalRamBytes);
    })
    .catch(err => {
        console.error('Erro ao buscar top5 processos:', err);
    });
}

function atualizarGraficos(data) {
  // Atualizar percentuais
  chartCPU.data.datasets[0].data = [data.cpu_percent, 100 - data.cpu_percent];
  chartRAM.data.datasets[0].data = [data.ram_usada_percent, 100 - data.ram_usada_percent];
  chartDISCO.data.datasets[0].data = [data.disco_usado_percent, 100 - data.disco_usado_percent];
console.log("RAM total:", data.ram_total_gb);
console.log("Disco total:", data.disco_total_gb);

  // Calcular GB usados/total
  const ramTotalGB = Number(data.ram_total_gb || 0);
  const ramUsadoGB = ramTotalGB * (Number(data.ram_usada_percent || 0) / 100);

  const discoTotalGB = Number(data.disco_total_gb || 0);
  const discoUsadoGB = discoTotalGB * (Number(data.disco_usado_percent || 0) / 100);

  // Passar info para o plugin central
  chartRAM.data.datasets[0].centerInfo = { usedGB: ramUsadoGB, totalGB: ramTotalGB };
  chartDISCO.data.datasets[0].centerInfo = { usedGB: discoUsadoGB, totalGB: discoTotalGB };

  // Atualizar gráficos
  chartCPU.update();
  chartRAM.update();
  chartDISCO.update();

    try {
      if (typeof aplicarCriticidadeNosCharts === 'function') aplicarCriticidadeNosCharts(window._lastCompMap || {});
    } catch (e) { console.warn('Erro ao reaplicar criticidade nos semicirculares:', e); }
}

// Helpers
function num(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function validTotal(t) {
  return Number.isFinite(t) && t > 0;
}
function setPct(chart, pct) {
  if (!chart?.data?.datasets?.[0]) return;
  const p = Math.max(0, Math.min(100, pct));
  chart.data.datasets[0].data = [p, 100 - p];
}

function top5Processos(data, totalRamBytes){
  const container = document.getElementById('processList') || document.querySelector('.process-list');
    if (!container) return;
    container.innerHTML = '';

    if (!data || data.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'process-list-empty';
        empty.textContent = 'Sem processos disponíveis';
        container.appendChild(empty);
        return;
    }

    data.forEach(processo => {
    // Pegar o nome do processo (tentando várias opções)
    let nome = processo.nome || processo.nome_processo || processo.name || processo.processName;
    if (!nome) {
        nome = "Sem nome";
    }

    // Pegar o valor de CPU (se não existir, usar 0)
    let cpu = processo.cpu_percent || processo.cpu || processo.cpuPercent || processo.cpuUsage || 0;
    cpu = Number(cpu);

    // Pegar o valor de RAM (se não existir, usar 0)
    let ram = processo.memory_rss || processo.ram_percent || processo.ram || processo.ramPercent || processo.memory_percent || processo.mem_percent || processo.mem || 0;
    ram = Number(ram);

    // Classificar severidade do processo
    let severityClass = "process-list-item-estavel";
    if (cpu >= 90) {
        severityClass = "process-list-item-critico";
    } else if (cpu >= 70) {
        severityClass = "process-list-item-medio";
    }

    // Criar elementos HTML
    const item = document.createElement("div");
    item.className = `process-list-item ${severityClass}`;

    const info = document.createElement("div");
    info.className = "process-item-info";

    const pName = document.createElement("p");
    pName.textContent = nome;

    const metrics = document.createElement("div");
    metrics.className = "process-metrics";

    // Mostrar CPU
    const pCpu = document.createElement("p");
    pCpu.className = "text-bold";
    pCpu.textContent = `CPU: ${cpu.toFixed(2)}%`;

    // Mostrar RAM
    const pRam = document.createElement("p");
    pRam.className = "text-bold";

    let ramText;
    if (processo.memory_rss && totalRamBytes) {
        // Se veio em bytes, calcular porcentagem
        const pct = (processo.memory_rss / totalRamBytes) * 100;
        ramText = pct.toFixed(2) + "%";
    } else if (ram <= 100) {
        // Se parece porcentagem
        ramText = ram.toFixed(2) + "%";
    } else {
        // Se parece ser bytes
        ramText = humanizeBytes(ram);
    }

    pRam.textContent = `RAM: ${ramText}`;

    // Montar estrutura
    metrics.appendChild(pCpu);
    metrics.appendChild(pRam);
    info.appendChild(pName);
    info.appendChild(metrics);
    item.appendChild(info);

    container.appendChild(item);
});
}

// Buscar dados históricos do S3 e atualizar o gráfico de componentes
// Buscar dados históricos do S3 e atualizar gráfico + KPIs
async function carregarDadosHistoricoS3() {
  try {
    const select = document.getElementById("select-controlador");
    const selectedId = select ? select.value : (sessionStorage.ID_CONTROLADOR || "");
    const selectedSerial = (select && select.selectedOptions[0]) ? select.selectedOptions[0].text : "";
    const controladorParam = encodeURIComponent(selectedSerial || selectedId);

    const resposta = await fetch(`/robotica/dados/historico?controlador=${controladorParam}&limite=6`);
    if (!resposta.ok) {
      console.error("Erro ao buscar dados:", resposta.status);
      return;
    }

    let raw = await resposta.json();

    let registros = [];
    if (Array.isArray(raw)) registros = raw;
    else if (raw.records) registros = raw.records;
    else if (raw.data) registros = raw.data;
    else {
      console.warn("Formato inesperado de JSON");
      return;
    }

    // Normalizar dados
    const normalizados = registros.map(item => ({
      timestamp: item.timestamp || item.time || null,
      cpu_percent: Number(item.cpu_percent || item.cpu || 0),
      ram_usada_percent: Number(item.ram_usada_percent || item.ram || 0),
      disco_usado_percent: Number(item.disco_usado_percent || item.disk || 0),
      disco_total_gb: Number(item.disco_total_gb || item.disk_total || 0)
    })).filter(r => r.timestamp);

    // Ordenar e pegar últimos 6
    normalizados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const ultimos6 = normalizados.slice(-6);

    // Atualizar gráfico
    atualizarGraficoComponentes(ultimos6);

    // KPIs CPU
    const cpuValues = ultimos6.map(r => r.cpu_percent).filter(v => !isNaN(v));
    const picoCPU = cpuValues.length ? Math.max(...cpuValues) : 0;
    const mediaCPU = cpuValues.length ? cpuValues.reduce((soma, v) => soma + v, 0) / cpuValues.length : 0;

    // Disco restante em GB
    const ultimoRegistro = ultimos6[ultimos6.length - 1];
    const discoTotalGB = ultimoRegistro?.disco_total_gb || 0;
    const discoUsadoPct = ultimoRegistro?.disco_usado_percent || 0;

    const discoConsumidoGB = discoTotalGB * (discoUsadoPct / 100);
    const discoRestanteGB = discoTotalGB - discoConsumidoGB;

    // Atualizar HTML
    atualizarKPIsHTML(picoCPU, mediaCPU, discoRestanteGB);

    // Aplicar criticidade
    aplicarCriticidadeNosKPIs(window._lastCompMap || {}, picoCPU, mediaCPU, ultimoRegistro);

  } catch (err) {
    console.error("Erro geral:", err);
  }
}

// Atualiza os valores no HTML
function atualizarKPIsHTML(picoCPU, mediaCPU, discoRestanteGB) {
  const elmPicoCPU = document.getElementById('pico-cpu');
  if (elmPicoCPU) elmPicoCPU.textContent = picoCPU.toFixed(2) + '%';

  const elmMediaCPU = document.getElementById('media-cpu');
  if (elmMediaCPU) elmMediaCPU.textContent = mediaCPU.toFixed(2) + '%';

  const elmDiscoGB = document.getElementById('disco-gb');
  if (elmDiscoGB) elmDiscoGB.textContent = discoRestanteGB.toFixed(2) + ' GB restantes';

  const elmTimestamp = document.getElementById('ultima-atualizacao');
  if (elmTimestamp) {
    const agora = new Date();
    elmTimestamp.textContent = agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
}



// Atualizar o gráfico de componentes (grafico_componentes) com dados do S3
function atualizarGraficoComponentes(dados) {
  if (!Array.isArray(dados) || dados.length === 0) {
    console.warn('Sem dados válidos para atualizar gráfico de componentes');
    return;
  }

  try {
    // Filtrar itens com timestamp válido e ordenar do mais antigo ao mais novo
    const itensValidos = dados.filter(d => {
      if (!d || !d.timestamp) return false;
      const t = new Date(d.timestamp).getTime();
      return !isNaN(t);
    });

    const ordenados = itensValidos.sort((a, b) => {
      return new Date(a.timestamp) - new Date(b.timestamp);
    });

    // Labels completas (data e hora) e apenas hora
    const fullLabels = ordenados.map(d => {
      const dt = new Date(d.timestamp);
      return dt.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    });

    const timeLabels = ordenados.map(d => {
      const dt = new Date(d.timestamp);
      return dt.toLocaleTimeString('pt-BR', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
      });
    });

    // Dados das métricas (se não vier número, vira 0)
    const cpuData = ordenados.map(d => Number(d.cpu_percent) || 0);
    const ramData = ordenados.map(d => Number(d.ram_usada_percent) || 0);
    const discoData = ordenados.map(d => Number(d.disco_usado_percent) || 0);

    console.log(
      'Atualizando gráfico:',
      'registros válidos =', ordenados.length,
      'intervalo =',
      ordenados[0]?.timestamp || 'N/A', '->',
      ordenados[ordenados.length - 1]?.timestamp || 'N/A'
    );

    // Atualizar gráfico se existir
    if (chartComponents) {
      chartComponents.data.labels = timeLabels;
      chartComponents.data.datasets[0].data = cpuData;
      chartComponents.data.datasets[1].data = ramData;
      chartComponents.data.datasets[2].data = discoData;

      // Guardar labels para callbacks
      chartComponents._xLabelsFull = fullLabels;
      chartComponents._xLabels = timeLabels;

      // Configurar eixo X para não pular labels e usar nosso callback
      const xTicks = (chartComponents.options.scales ||= {}).x ||= {};
      xTicks.ticks ||= {};
      xTicks.ticks.autoSkip = false;
      xTicks.ticks.maxRotation = 0;
      xTicks.ticks.callback = function(value, index) {
        const arr = chartComponents._xLabels || chartComponents.data.labels;
        return arr?.[index] ?? value;
      };

      // Forçar escala Y de 0 a 100 (porcentagens)
      const yScale = (chartComponents.options.scales.y ||= {});
      yScale.min = 0;
      yScale.max = 100;

      chartComponents.update();
      console.log('Gráfico de componentes atualizado com', dados.length, 'registros');

      // Reaplicar cores de criticidade, se disponível
      if (typeof aplicarCriticidadeNosCharts === 'function') {
        try {
          aplicarCriticidadeNosCharts(window._lastCompMap);
        } catch (e) {
          console.warn('Erro ao reaplicar criticidade:', e);
        }
      }
    } else {
      console.warn('chartComponents não definido');
    }
  } catch (err) {
    console.error('Erro ao atualizar gráfico de componentes:', err);
  }
}


// Buscar criticidade (limiares) do setor
async function carregarCriticidadeSetor(idSetor) {
  try {
    const resposta = await fetch('/robotica/buscarCriticidadeSetor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_setor: idSetor })
    });
    const criticidades = await resposta.json();
    
    console.log('Criticidades carregadas:', criticidades);
    exibirCriticidades(criticidades);
  } catch (err) {
    console.error('Erro ao buscar criticidade:', err);
  }
}

// Carregar controladores disponíveis no setor
async function carregarControladoresSetor(idSetor, idControladorAtual) {
  try {
    const resposta = await fetch('/robotica/buscarControladoresPorSetor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_setor: idSetor })
    });
    const controladores = await resposta.json();
    
    console.log('Controladores do setor carregados:', controladores);
    
    const select = document.getElementById('select-controlador');
    if (select && controladores && controladores.length > 0) {
      select.innerHTML = ''; // limpar opções antigas
      controladores.forEach(ctrl => {
        const option = document.createElement('option');
        option.value = ctrl.numero_serial;
        option.textContent = ctrl.numero_serial || `Controlador ${ctrl.id_controlador}`;
        if (ctrl.numero_serial == idControladorAtual) {
          option.selected = true;
        }
        select.appendChild(option);
      });
    }
  } catch (err) {
    console.error('Erro ao carregar controladores:', err);
  }
}

// Mudar controlador (quando usuário seleciona no dropdown)
function mudarControlador(novoId) {
  if (!novoId) return;
  
  console.log('Mudando para controlador:', novoId);
  sessionStorage.setItem('CONTROLADOR', novoId);
  
  // Recarregar dados do novo controlador
  carregarTelemetria(novoId);
  carregarTop5Processos(novoId);
  carregarUltimosRegistrosTelemetria(novoId);
}

// Exibir cards de criticidade
function exibirCriticidades(criticidades) {
  if (!criticidades || criticidades.length === 0) {
    console.warn("Sem criticidades disponíveis");
    return;
  }

  // Guardar limiares de CPU, RAM e Disco
  const compMap = {
    cpu: { medio: null, critico: null },
    ram: { medio: null, critico: null },
    disco: { medio: null, critico: null }
  };

  // Percorrer lista e preencher compMap
  criticidades.forEach(item => {
    const nome = (item.nome || "").toLowerCase();
    const lMedio = Number(item.limiar_medio) || null;
    const lCritico = Number(item.limiar_critico) || null;

    if (nome.includes("cpu")) {
      compMap.cpu.medio = lMedio ?? compMap.cpu.medio;
      compMap.cpu.critico = lCritico ?? compMap.cpu.critico;
    } else if (nome.includes("ram") || nome.includes("mem")) {
      compMap.ram.medio = lMedio ?? compMap.ram.medio;
      compMap.ram.critico = lCritico ?? compMap.ram.critico;
    } else if (nome.includes("disco") || nome.includes("disk")) {
      compMap.disco.medio = lMedio ?? compMap.disco.medio;
      compMap.disco.critico = lCritico ?? compMap.disco.critico;
    }
  });

  // Guardar globalmente
  window._lastCompMap = compMap;

  // Funções auxiliares para formatar
  const pct = v => (v == null ? "--" : v + "%");
  const between = (a, b) => {
    if (a == null && b == null) return "--";
    if (a == null) return "Abaixo de " + pct(b);
    if (b == null) return pct(a);
    return pct(a) + " - " + pct(b);
  };

  // Atualizar cards
  const cardCritico = document.getElementById("card-critico");
  const cardMedio = document.getElementById("card-medio");
  const cardEstavel = document.getElementById("card-estavel");

  if (cardCritico) {
    cardCritico.innerHTML = `
      <div class="crit-card-title">Crítico</div>
      <div>CPU: ${pct(compMap.cpu.critico)}</div>
      <div>RAM: ${pct(compMap.ram.critico)}</div>
      <div>Disco: ${pct(compMap.disco.critico)}</div>
    `;
  }

  if (cardMedio) {
    cardMedio.innerHTML = `
      <div class="crit-card-title">Médio</div>
      <div>CPU: ${between(compMap.cpu.medio, compMap.cpu.critico)}</div>
      <div>RAM: ${between(compMap.ram.medio, compMap.ram.critico)}</div>
      <div>Disco: ${between(compMap.disco.medio, compMap.disco.critico)}</div>
    `;
  }

  if (cardEstavel) {
    cardEstavel.innerHTML = `
      <div class="crit-card-title">Estável</div>
      <div>CPU: Abaixo de ${pct(compMap.cpu.medio)}</div>
      <div>RAM: Abaixo de ${pct(compMap.ram.medio)}</div>
      <div>Disco: Abaixo de ${pct(compMap.disco.medio)}</div>
    `;
  }

  // Aplicar cores nos gráficos
  if (typeof aplicarCriticidadeNosCharts === "function") {
    aplicarCriticidadeNosCharts(compMap);
  }
}


// Aplica as cores dos gauges (semicirculares) usando os limiares por componente
function aplicarCriticidadeNosCharts(compMap) {
  // cores: estável (verde), médio (amarelo), crítico (vermelho)
  const COLORS_STATUS = { stable: '#4CAF50', medium: '#e6ac00', critical: '#F44336' };

  const apply = (chart, comp) => {
    if (!chart || !chart.data || !chart.data.datasets || !chart.data.datasets[0]) return;

    const ds = chart.data.datasets[0];
    const valor = Number(ds.data && ds.data[0] !== undefined ? ds.data[0] : NaN);

    let medio = compMap[comp] && compMap[comp].medio !== undefined ? compMap[comp].medio : null;
    let critico = compMap[comp] && compMap[comp].critico !== undefined ? compMap[comp].critico : null;

    medio = medio !== null && medio !== undefined ? Number(medio) : null;
    critico = critico !== null && critico !== undefined ? Number(critico) : null;

    // normalize: se médio > crítico (config incorreta), inverter
    if (medio !== null && critico !== null && medio > critico) {
      const tmp = medio; medio = critico; critico = tmp;
      console.warn(`Limiar médio maior que crítico para ${comp} — invertendo valores: medio=${medio}, critico=${critico}`);
    }

    // log para debug
    console.debug(`aplicarCriticidade - comp=${comp} valor=${valor} medio=${medio} critico=${critico}`);

    let status = 'stable';
    if (critico !== null && !isNaN(valor) && valor >= critico) status = 'critical';
    else if (medio !== null && !isNaN(valor) && valor >= medio) status = 'medium';

    const color = COLORS_STATUS[status] || COLORS_STATUS.stable;

    // atualizar cores do dataset
    ds.centerColor = color;
    ds.borderColor = color;
    if (Array.isArray(ds.backgroundColor)) ds.backgroundColor[0] = color;

    // atualizar gráfico
    try { chart.update(); } catch(e) {}
  };

  try { apply(typeof chartCPU !== 'undefined' ? chartCPU : window.chartCPU, 'cpu'); } catch(e){}
  try { apply(typeof chartRAM !== 'undefined' ? chartRAM : window.chartRAM, 'ram'); } catch(e){}
  try { apply(typeof chartDISCO !== 'undefined' ? chartDISCO : window.chartDISCO, 'disco'); } catch(e){}
}



// Buscar últimos 6 registros de telemetria para calcular KPIs
async function carregarUltimosRegistrosTelemetria(idControlador) {
  try {
    console.log('Iniciando fetch de últimos 6 registros para controlador:', idControlador);
    
    const resposta = await fetch('/robotica/buscarUltimosRegistrosTelemetria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_controlador: idControlador, limite: 6 })
    });

    console.log('Resposta status:', resposta.status);

    const registros = await resposta.json();
    
    console.log('Registros recebidos (últimos 6):', registros);

    if (registros && registros.length > 0) {
      calcularKPIs(registros); 
    } else {
      console.warn('Nenhum registro retornado para controlador:', idControlador);
    }
  } catch (err) {
    console.error('Erro ao buscar últimos registros:', err);
  }
}

// Monta o mapa de parâmetros (limiares) a partir dos dados do banco
function montarCompMap(parametros) {
  const compMap = { cpu: {}, disco: {} };
  (parametros || []).forEach(p => {
    const comp = p.fk_componente === 1 ? 'cpu'
               : p.fk_componente === 3 ? 'disco' : null;
    if (!comp) return;
    if (p.criticidade === 1) compMap[comp].medio = Number(p.valor);
    if (p.criticidade === 2) compMap[comp].critico = Number(p.valor);
  });
  window._lastCompMap = compMap;
  console.table(compMap); // debug: mostra limiares
}

// Calcula os KPIs principais
function calcularKPIs(registros) {
  if (!registros || registros.length === 0) {
    console.warn('Sem registros para calcular KPIs');
    return;
  }
}

// Atualiza os valores no HTML
function atualizarKPIsHTML(picoCPU, mediaCPU, discoGB) {
  const elmPicoCPU = document.getElementById('pico-cpu');
  if (elmPicoCPU) elmPicoCPU.textContent = picoCPU.toFixed(2) + '%';

  const elmMediaCPU = document.getElementById('media-cpu');
  if (elmMediaCPU) elmMediaCPU.textContent = mediaCPU.toFixed(2) + '%';

  const elmDiscoGB = document.getElementById('disco-gb');
  if (elmDiscoGB) elmDiscoGB.textContent = discoGB.toFixed(2) + ' GB';

  const elmTimestamp = document.getElementById('ultima-atualizacao');
  if (elmTimestamp) {
    const agora = new Date();
    elmTimestamp.textContent = agora.toLocaleTimeString('pt-BR', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  }
}

// Aplica criticidade visual nos KPIs
function aplicarCriticidadeNosKPIs(compMap, picoCPU, mediaCPU, ultimoRegistro) {
  const COLORS_STATUS = { stable: '#4CAF50', medium: '#e6ac00', critical: '#F44336' };

  const apply = (elmId, valor, comp) => {
    const elm = document.getElementById(elmId);
    if (!elm) return;

    let medio = compMap[comp]?.medio ?? null;
    let critico = compMap[comp]?.critico ?? null;

    if (medio !== null && critico !== null && medio > critico) {
      const tmp = medio; medio = critico; critico = tmp;
    }

    let status = 'stable';
    if (critico !== null && valor >= critico) status = 'critical';
    else if (medio !== null && valor >= medio) status = 'medium';

    elm.style.color = COLORS_STATUS[status];
    console.debug(`KPI ${comp} (${elmId}) valor=${valor} → ${status}`);
  };

  apply('pico-cpu', picoCPU, 'cpu');
  apply('media-cpu', mediaCPU, 'cpu');

  const discoVal = Number(ultimoRegistro?.disco_usado_percent);
  apply('disco-gb', discoVal, 'disco');
}

// Exemplo de integração: depois que você carregar os dados
// (via fetch, AJAX ou WebSocket), chame assim:
function atualizarDashboard(dados) {
  montarCompMap(dados.parametros);   // monta limiares
  calcularKPIs(dados.registros);     // calcula e aplica cores
}