Autobotics – Monitoramento Inteligente da Saúde Digital de Controladores de Robôs Industriais
Documentação
Acesse a documentação completa do projeto no link:
https://seulinkparadocumentacao.com/autobotics

📌 Visão Geral
O Autobotics é uma plataforma unificada para coleta, armazenamento e análise em tempo real das métricas de CPU, RAM e armazenamento de controladores de robôs industriais, com foco no setor automotivo.
Utilizando práticas ITIL de gestão de incidentes e problemas, o sistema prevê falhas digitais antes que impactem a produção, acionando alertas automáticos e gerando ordens de serviço para manutenção proativa.

🚀 Objetivos
- Prevenir paradas não planejadas causadas por sobrecarga ou degradação dos recursos computacionais.
- Reduzir custos de downtime e elevar o OEE (Overall Equipment Effectiveness).
- Entregar ROI em até 12 meses com economia potencial de R$ 2,5 a 6 milhões/ano para uma planta com 200 robôs.

📡 Funcionalidades Principais
- Coleta contínua de métricas de CPU, RAM e armazenamento via agente Python embarcado no controlador.
- API central para ingestão, validação e persistência dos dados em banco de séries temporais.
- Dashboard web responsivo com visualização em tempo real, histórico e filtros por controlador e período.
- Geração automática de alertas via Slack e criação de tickets de incidente conforme fluxo ITIL.
- Relatórios customizáveis e exportação de dados para análise avançada.

🔧 Tecnologias Utilizadas
- Linguagens: Python (coleta), JavaScript/TypeScript (frontend), Java/Kotlin (API)
- Banco de dados: InfluxDB ou TimescaleDB (séries temporais)
- Frameworks: FastAPI/Flask (backend), React/Vue (frontend)
- Integrações: Slack Webhooks, MQTT/EtherNet-IP, OPC-UA
- Infraestrutura: AWS EC2, Docker, GitHub Actions (CI/CD)

🏭 Como Funciona?
- Agente Python instalado no controlador coleta métricas de CPU, uso de memória e espaço em disco a cada intervalo configurável.
- Dados são enviados à API via HTTP ou MQTT com segurança (TLS e autenticação).
- API processa, valida e armazena as métricas no banco de séries temporais.
- Motor de regras avalia thresholds estáticos e dinâmicos, disparando alertas quando necessário.
- Frontend exibe dashboards em tempo real e histórico; alertas criam ordens de serviço no sistema de ticket ITIL.

📈 Impacto Esperado
- Redução de até 40% nas paradas não planejadas por falhas digitais.
- Aumento de 5% a 8% no OEE das linhas de produção.
- Economia anual estimada de R$ 2,5 a 6 milhões em grande escala.
- Retorno do investimento em 6 a 12 meses.

📌 Status do Projeto
- Fase atual: Sprint 0 – Visão, escopo, personas e backlog inicial.
- Início previsto da Sprint 1: coleta de métricas e protótipo de dashboard.

👥 Equipe
- César Augusto — Product Owner
- Bill Hebert — Tech Lead & Backend
- Dereck Baksa — DevOps & Infraestrutura
- Erick Araújo — Frontend & UX/UI
- Gustavo Bello — Engenheiro de Automação & Testes
