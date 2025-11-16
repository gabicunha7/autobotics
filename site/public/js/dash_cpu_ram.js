
// Configuração do gráfico rosca de CPU (KPI)
const cpu_pie = document.getElementById('cpu-mean-pie')

const data_cpu_pie = {
  datasets: [{
    label: 'Média de CPU da última hora (%)',
    data: [85, 15],
    backgroundColor: [
        'rgb(255, 75, 75)',
      'rgb(213, 213, 213)'
    ],
    hoverOffset: 4
  }]
};

new Chart(cpu_pie, {
    type: 'doughnut',
    data: data_cpu_pie,
    options: {
        cutout: '85%'
    }
})

// Configuração do gráfico rosca de RAM (KPI)
const ram_pie = document.getElementById('ram-mean-pie')

const data_ram_pie = {
  datasets: [{
    label: 'Média de RAM da última hora (%)',
    data: [55, 45],
    backgroundColor: [
        'rgb(239, 198, 0)',
      'rgb(213, 213, 213)'
    ],
    hoverOffset: 4
  }]
};

new Chart(ram_pie, {
    type: 'doughnut',
    data: data_ram_pie,
    options: {
        cutout: '85%'
    }
})

// Configuração do gráfico rosca de Capturas (Measures)
const measures_pie = document.getElementById('pie-measures-chart')

const data_measures_pie = {
  datasets: [{
    label: 'Capturas da última hora',
    data: [36, 8, 2],
    backgroundColor: [
        'rgb(70, 255, 45)',
      'rgb(239, 198, 0)',
      'rgb(255, 0, 0)'
    ],
    hoverOffset: 4
  }]
};

new Chart(measures_pie, {
    type: 'doughnut',
    data: data_measures_pie,
    options: {
        cutout: '70%'
    }
})

// Configuração do gráfico de linha de CPU
const cpu_line = document.getElementById('cpu-line-chart');

const labels_cpu_line = ['12:00', '12:05', '12:10', '12:15', '12:20', '12:25', '12:30', '12:35', '12:40', '12:45', '12:50', '12:55', '13:00'];
const data_cpu_line = {
  labels: labels_cpu_line,
  datasets: [{
    label: 'Média CPU (%)',
    data: [22, 24, 28, 21, 33, 30, 37, 35, 33, 75, 89, 93],
    fill: true,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

new Chart(cpu_line, {
    type: 'line',
    data: data_cpu_line
})

// Configuração do gráfico de linha de RAM
const ram_line = document.getElementById('ram-line-chart');

const labels_ram_line = ['12:00', '12:05', '12:10', '12:15', '12:20', '12:25', '12:30', '12:35', '12:40', '12:45', '12:50', '12:55', '13:00'];
const data_ram_line = {
  labels: labels_ram_line,
  datasets: [{
    label: 'Média RAM (%)',
    data: [22, 24, 28, 21, 33, 30, 37, 35, 33, 75, 89, 93],
    fill: true,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
};

new Chart(ram_line, {
    type: 'line',
    data: data_ram_line
})