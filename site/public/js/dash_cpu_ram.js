let chartCpuRam = null;
let chartKpiCpu = null;
let chartKpiRam = null;

async function buscarCpuParametros() {
  let parametros = await buscarParametros()

  let parametrosCpu = []

  for (parametro in parametros) {
    if (parametros[parametro].nome == "CPU") {
      parametrosCpu.push(parametros[parametro].valor)
    }
  }

  return parametrosCpu
}

function atualizarHorario(horario) {
  let horarioText = document.getElementById("capture-time")

  let horaAtras = horario;

  let hora = Number(horaAtras.substring(0, 2))
  let minuto = horaAtras.substring(3)

  console.log("hora: ", hora);
  console.log("minutos: ", minuto);
  
  

  hora = hora - 1;

  if (hora < 0) hora = 23;

  horarioText.innerHTML = `${hora}:${minuto} - ${horario}`
}

async function buscarRamParametros() {
  let parametros = await buscarParametros()

  let parametrosRam = []

  for (parametro in parametros) {
    if (parametros[parametro].nome == "RAM") {
      parametrosRam.push(parametros[parametro].valor)
    }
  }

  return parametrosRam
}

async function criarGraficos(dadosControlador) {
  var medias = dadosControlador.media5Minutos
  var horarios = []
  var cpu = []
  var ram = []

  let parametrosRam = await buscarRamParametros()
  let parametrosCpu = await buscarCpuParametros()

  let top5processos = dadosControlador.topProcessos.processos.topProcessos;


  // parametrosCpu ou ram [0] sempre será o maior (criticidade)

  top5processos = top5processos
    .replace(/'/g, '"')          // troca aspas simples
    .replace(/None/g, 'null')    // se vier null estilo Python
    .trim();

  top5processos = JSON.parse(top5processos);

  console.log(top5processos);

  let horariosChave = Object.keys(medias);

  horariosChave.forEach(horario => {
    let info = medias[horario];
    console.log(horario, info.cpu, info.ram);
    horarios.push(horario)
    cpu.push(info.cpu)
    ram.push(info.ram)
  });

  console.log("Listas cpu: " + cpu);
  console.log("Listas ram: " + ram);

  let listaProcessos = document.getElementById("process-list")
  listaProcessos.innerHTML = ""

  for (processo in top5processos) {
    listaProcessos.innerHTML += `
            <div class="process-list-item process-list-item-padrao">
                <div class="process-item-info">
                  <p>${top5processos[processo].name}</p>
                  <div class="process-metrics">
                    <p>PiD: ${top5processos[processo].pid}</p>
                    <p class="text-bold">CPU: ${top5processos[processo].cpu_percent}%</p>
                    <p class="text-bold">RAM: ${top5processos[processo].memory_rss}%</p>
                  </div>
                </div>
                <div class="process-item-time">
                  <p>${dadosControlador.topProcessos.processos.timestamp}</p>
                </div>
            </div>
            `
    console.log(top5processos[processo].pid);
  }

  // Configuração do gráfico rosca de CPU (KPI)
  let kpi_cpu_mean = document.getElementById('cpu-mean-pie')

  let meanCpu = dadosControlador.mediaCpuRam.medias.cpu
  let color = "rgb(70, 255, 45)"

  if (meanCpu >= parametrosCpu[0]) {
    color = "rgb(255, 75, 75)"
    document.getElementById('kpi-mean-value-cpu').style.color = color
  }
  else if (meanCpu >= parametrosCpu[1]) {
    color = "rgb(255, 217, 32)"
    document.getElementById('kpi-mean-value-cpu').style.color = color
  }

  let data_kpi_cpu_mean = {
    datasets: [{
      label: 'Média de CPU da última hora (%)',
      data: [meanCpu, 100 - meanCpu],
      backgroundColor: [
        color,
        'rgb(213, 213, 213)'
      ],
      hoverOffset: 4
    }]
  };

  if (chartKpiCpu) chartKpiCpu.destroy();

  chartKpiCpu = new Chart(kpi_cpu_mean, {
    type: 'doughnut',
    data: data_kpi_cpu_mean,
    options: {
      cutout: '85%'
    }
  })

  // Configuração do gráfico rosca de RAM (KPI)
  let kpi_ram_mean = document.getElementById('ram-mean-pie')

  let meanRam = dadosControlador.mediaCpuRam.medias.ram
  color = "rgb(70, 255, 45)"

  if (meanRam > parametrosRam[0]) {
    color = "rgb(255, 75, 75)"
    document.getElementById('kpi-mean-value-ram').style.color = color
    document.getElementById('kpi-mean-value-ram-total').style.color = color
  }
  else if (meanRam > parametrosRam[1]) {
    color = "rgb(255, 217, 32)"
    document.getElementById('kpi-mean-value-ram').style.color = color
    document.getElementById('kpi-mean-value-ram-total').style.color = color
  }

  let data_kpi_ram_mean = {
    datasets: [{
      label: 'Média de RAM da última hora (%)',
      data: [dadosControlador.mediaCpuRam.medias.ram, 100 - dadosControlador.mediaCpuRam.medias.ram],
      backgroundColor: [
        color,
        'rgb(213, 213, 213)'
      ],
      hoverOffset: 4
    }]
  };

  if (chartKpiRam) chartKpiRam.destroy();

  chartKpiRam = new Chart(kpi_ram_mean, {
    type: 'doughnut',
    data: data_kpi_ram_mean,
    options: {
      cutout: '85%'
    }
  })

  // Configuração do gráfico de linha de CPU e RAM
  let cpu_line = document.getElementById('cpu-line-chart');

  let labels_cpu_line = horarios.reverse();
  let data_cpu_line = {
    labels: labels_cpu_line,
    datasets: [{
      label: 'Média CPU (%)',
      data: cpu.reverse(),
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    },
    {
      label: 'Média RAM (%)',
      data: ram.reverse(),
      borderColor: 'rgba(255, 179, 15, 1)',
      tension: 0.1
    },
    {
      label: 'Nível crítico CPU(%)',
      data: [parametrosCpu[1], parametrosCpu[1], parametrosCpu[1], parametrosCpu[1], parametrosCpu[1], parametrosCpu[1], parametrosCpu[1], parametrosCpu[1], parametrosCpu[1], parametrosCpu[1], parametrosCpu[1], parametrosCpu[1]],
      borderColor: 'rgb(255, 75, 75)',
      tension: 0.1
    },
  {
      label: 'Nível crítico RAM(%)',
      data: [parametrosRam[1], parametrosRam[1], parametrosRam[1], parametrosRam[1], parametrosRam[1], parametrosRam[1], parametrosRam[1], parametrosRam[1], parametrosRam[1], parametrosRam[1], parametrosRam[1], parametrosRam[1]],
      borderColor: 'rgba(111, 255, 75, 1)',
      tension: 0.1
    }]
  };

  if (chartCpuRam) chartCpuRam.destroy();

  chartCpuRam = new Chart(cpu_line, {
    type: 'line',
    data: data_cpu_line,
    options: {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 16
            }
          }
        }
      },
      scales: {
        x: {
          ticks: {
            font: {
              size: 18
            }
          }
        },
        y: {
          max: 100,
          ticks: {
            font: {
              size: 18
            }
          }
        }
      }
    }
  })
}

async function criarKpis(dadosControlador) {
  var medias = dadosControlador.media5Minutos
  var horarios = []
  var cpu = []
  var ram = []

  let horariosChave = Object.keys(medias);

  horariosChave.forEach(horario => {
    let info = medias[horario];
    console.log(horario, info.cpu, info.ram);
    horarios.push(horario)
    cpu.push(info.cpu)
    ram.push(info.ram)
  });

  let parametrosCpu = await buscarCpuParametros()
  let parametrosRam = await buscarRamParametros()

  // KPI de média de CPU
  var kpi_mean_cpu = document.getElementById("kpi-mean-value-cpu")
  kpi_mean_cpu.innerHTML = dadosControlador.mediaCpuRam.medias.cpu + "%"

  // KPI de média de RAM
  var kpi_mean_ram = document.getElementById("kpi-mean-value-ram")
  kpi_mean_ram.innerHTML = dadosControlador.mediaCpuRam.medias.ram + "%"

  var kpi_mean_ram_total = document.getElementById("kpi-mean-value-ram-total")
  kpi_mean_ram_total.innerHTML = dadosControlador.mediaCpuRam.metricas.ramUsada + "/" + dadosControlador.mediaCpuRam.metricas.ramTotal + "GB"

  // KPIS de pico
  var kpi_chart_cpu_time = document.getElementById("kpi-info-cpu-time")
  kpi_chart_cpu_time.innerHTML = dadosControlador.picoCpuRam.cpu.timestamp

  var kpi_chart_cpu = document.getElementById("kpi-chart-info-value-cpu")
  
  
  if (dadosControlador.picoCpuRam.cpu.valor > parametrosCpu[1]) {
    kpi_chart_cpu.classList.remove("text-green")
    kpi_chart_cpu.classList.add("text-red")
  }
  else if (dadosControlador.picoCpuRam.cpu.valor > parametrosCpu[0]) {
    kpi_chart_cpu.classList.remove("text-green")
    kpi_chart_cpu.classList.add("text-yellow")
  }
  kpi_chart_cpu.innerHTML =
    dadosControlador.picoCpuRam.cpu.valor;


  var kpi_chart_ram = document.getElementById("kpi-chart-info-value-ram")
  if (dadosControlador.picoCpuRam.ram.valor > parametrosRam[1]) {
    kpi_chart_ram.classList.remove("text-green")
    kpi_chart_ram.classList.add("text-red")
  }
  else if (dadosControlador.picoCpuRam.ram.valor > parametrosRam[0]) {
    kpi_chart_ram.classList.remove("text-green")
    kpi_chart_ram.classList.add("text-yellow")
  }
  kpi_chart_ram.innerHTML = dadosControlador.picoCpuRam.ram.valor

  var kpi_chart_ram_time = document.getElementById("kpi-info-ram-time")
  kpi_chart_ram_time.innerHTML = dadosControlador.picoCpuRam.ram.timestamp

  // KPIS ultimos dados

  var kpi_chart_cpu_last_time = document.getElementById("kpi-info-cpu-time-last")
  kpi_chart_cpu_last_time.innerHTML = dadosControlador.ultimasCapturas.cpu.timestamp

  var kpi_chart_cpu_last = document.getElementById("kpi-chart-info-value-cpu-last")

  console.log("COMPARANDO SE " + cpu[0] + " EH MAIOR QUE " + parametrosRam[0]);

  if (cpu[0] > parametrosCpu[1]) {
    kpi_chart_cpu_last.classList.remove("text-green")
    kpi_chart_cpu_last.classList.remove("text-yellow")
    kpi_chart_cpu_last.classList.add("text-red")
  }
  else if (cpu[0] > parametrosCpu[0]) {
    kpi_chart_cpu_last.classList.remove("text-green")
    kpi_chart_cpu_last.classList.remove("text-red")
    kpi_chart_cpu_last.classList.add("text-yellow")
  }
  else {
    kpi_chart_cpu_last.classList.remove("text-yellow")
    kpi_chart_cpu_last.classList.remove("text-red")
    kpi_chart_cpu_last.classList.add("text-green")
  }
  kpi_chart_cpu_last.innerHTML = cpu[0]

  var kpi_chart_ram_time_last = document.getElementById("kpi-info-ram-time-last")
  kpi_chart_ram_time_last.innerHTML = dadosControlador.ultimasCapturas.ram.timestamp

  var kpi_chart_ram_last = document.getElementById("kpi-chart-info-value-ram-last")
  kpi_chart_ram_last.innerHTML = ram[0]

  if (ram[0] > parametrosRam[1]) {
    kpi_chart_ram_last.classList.remove("text-green")
    kpi_chart_ram_last.classList.add("text-red")
  }
  else if (ram[0] > parametrosRam[0]) {
    kpi_chart_ram_last.classList.remove("text-green")
    kpi_chart_ram_last.classList.remove("text-red")
    kpi_chart_ram_last.classList.add("text-yellow")
  }
  else {
    kpi_chart_ram_last.classList.remove("text-yellow")
    kpi_chart_ram_last.classList.remove("text-red")
    kpi_chart_ram_last.classList.add("text-green")
  }
}

async function popularDashboard(controlador) {
  let dados = await lerJsonS3();
  let nomeControlador = controlador
  document.getElementById("selectControlador").value = controlador
  console.log("NOME CONTROLADOR: ", nomeControlador);
  console.log(dados);
  
  let dadosControlador = dados[nomeControlador]
  let horario = dados[nomeControlador].ultimasCapturas.ram.timestamp

  console.log(dadosControlador);


  criarKpis(dadosControlador)
  criarGraficos(dadosControlador)
  atualizarHorario(horario)
}

function buscarParametros() {
  return fetch("/cpuRam/buscarParametros", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      empresa: sessionStorage.getItem("EMPRESA_USUARIO"),
      setor: sessionStorage.getItem("SETOR_USUARIO")
    })
  })
    .then(resposta => {
      if (!resposta.ok) {
        throw "Erro ao buscar parâmetros do setor.";
      }
      else {
        return resposta.json();
      }
    })
    .catch(erro => {
      console.error(erro);
    });
}

async function exibirParametros() {
  let kpi_parametros = document.getElementById("kpi-parameters")
  let parametros = await buscarParametros()
  console.log(`Parametros:`, parametros);
  for (parametro in parametros) {
    if (parametros[parametro].nome == "CPU" && parametros[parametro].criticidade == 2) {
      console.log("Os parametros de ", parametros[parametro].nome, " são ", parametros[parametro].valor, " criticidade ", parametros[parametro].criticidade);
      kpi_parametros.innerHTML += `<p class="text-bold">CPU - ${parametros[parametro].valor}%</p>`
    }
    if (parametros[parametro].nome == "RAM" && parametros[parametro].criticidade == 2) {
      console.log("Os parametros de ", parametros[parametro].nome, " são ", parametros[parametro].valor, " criticidade ", parametros[parametro].criticidade);
      kpi_parametros.innerHTML += `<p class="text-bold">RAM - ${parametros[parametro].valor}%</p>`
    }
  }

  let nomeSetor = await buscarNomeSetor(sessionStorage.getItem("SETOR_USUARIO"))
  kpi_parametros.innerHTML += `<p>Setor: ${nomeSetor[0].nome}</p>`
}

function buscarNomeSetor(setor) {
  return fetch("/cpuRam/buscarNomeSetor", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      setor: setor
    })
  })
    .then(resposta => {
      if (!resposta.ok) {
        throw "Erro ao buscar parâmetros do setor.";
      }
      else {
        return resposta.json();
      }
    })
    .then(dados => {
      console.log(dados);

      return dados
    })
    .catch(erro => {
      console.error(erro);
      return null
    });
}

function buscarControladores() {
  return fetch("/cpuRam/buscarControladores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      setor: sessionStorage.getItem("SETOR_USUARIO"),
      empresa: sessionStorage.getItem("EMPRESA_USUARIO")
    })
  })
    .then(resposta => {
      if (!resposta.ok) {
        throw "Erro ao buscar parâmetros do setor.";
      }
      else {
        return resposta.json();
      }
    })
    .then(dados => {
      console.log(dados);

      return dados
    })
    .catch(erro => {
      console.error(erro);
      return null
    });
}

async function listarControladores() {
  let controladores = await buscarControladores()
  let select = document.getElementById("selectControlador")
  
  for (controlador in controladores) {
    select.innerHTML += `<option value="${controladores[controlador].numero_serial}">${controladores[controlador].numero_serial}</option>`
  }
}

function trocarControlador() {
  let select = document.getElementById("selectControlador")
  sessionStorage.setItem("CONTROLADOR", select.value)
  popularDashboard(select.value)
}
// Amazon S3

async function lerJsonS3() {
  try {
    const resposta = await fetch('/s3RouteCpuRam/dados/ultimo');
    const texto = await resposta.text();

    if (!resposta.ok) {
      console.error('Erro na requisição /s3RouteHistoricoAlerta/dados/ultimo', resposta.status, texto);
      const msgEl = document.getElementById('erroBuscaS3');
      if (msgEl) msgEl.textContent = 'Erro do servidor ao buscar dados: ' + (texto || resposta.status);
      return null;
    }

    let data;
    try {
      data = JSON.parse(texto);
    } catch (e) {
      console.warn('Resposta não é JSON, usando texto:', texto);
      data = texto;
    }

    console.log('ultimo JSON do bucket (histórico de alertas):', data);

    sessionStorage.JSON_ALERTA = JSON.stringify(data);


    return data;

  } catch (err) {
    console.error('Erro ao buscar último arquivo do S3:', err);
    const msgEl = document.getElementById('erroBuscaS3');
    if (msgEl) msgEl.textContent = 'Falha ao buscar dados do S3: ' + (err.message || err);
    return null;
  }
}
listarControladores()
popularDashboard(sessionStorage.getItem("CONTROLADOR"))
exibirParametros()

setInterval(() => {popularDashboard(sessionStorage.getItem("CONTROLADOR"))}, 30000)