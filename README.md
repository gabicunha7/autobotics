# Autobotics – Monitoramento Inteligente da Saúde Digital de Controladores de Robôs Industriais

## Documentação
Acesse a documentação completa do projeto em:  
[Documentação do Projeto](https://bandteccom-my.sharepoint.com/:w:/g/personal/davi_ssilva_sptech_school/ET8NAfja_6hGmHQmD1Cz16QB_ba6oKQxlMQYcMHoU2hFgA?e=1pZPzf)

---

## 📌 Visão Geral
O **Autobotics** é um sistema unificado para coleta, armazenamento e análise em tempo real das métricas de **CPU, RAM e armazenamento** de controladores de robôs industriais, com foco no setor automotivo.  

Utilizando práticas **ITIL** de gestão de incidentes e problemas, o sistema prevê falhas digitais antes que impactem a produção, acionando alertas automáticos e gerando ordens de serviço para manutenção proativa.

---

## 🚀 Objetivos
- Prevenir paradas não planejadas causadas por sobrecarga ou degradação dos recursos computacionais  
- Reduzir custos de *downtime* e elevar o **OEE (Overall Equipment Effectiveness)**  
- Entregar ROI em até --- alguns meses --- , com economia potencial de **R$ 2,5 a 6 milhões/ano** para uma planta com 200 robôs  

---

## 📡 Funcionalidades Principais
- Coleta contínua de métricas de CPU, RAM e armazenamento via agente **Python** embarcado no controlador  
- **API central** para ingestão, validação e persistência dos dados em banco de séries temporais  
- **Dashboard web responsivo** com visualização em tempo real, histórico e filtros por controlador e período  
- **Geração automática de alertas** via Slack e criação de tickets de incidente conforme fluxo ITIL  
- **Relatórios customizáveis** e exportação de dados para análise avançada  

---

## 🔧 Tecnologias Utilizadas
- **Linguagens:** Python (coleta), JavaScript (API), Java (---)  
- **Banco de dados:** MySQL
- **Frameworks:** ---
- **Integrações:** Slack Webhooks ---
- **Infraestrutura:** AWS EC2, Docker ---

---

## 🏭 Como Funciona?
1. Agente **Python** instalado no controlador coleta métricas de CPU, uso de memória e espaço em disco em intervalos configuráveis  
2. Dados são enviados à API via **HTTP ou MQTT** com segurança (TLS e autenticação)  
3. API processa, valida e armazena as métricas no banco.
4. **Frontend** exibe dashboards em tempo real e histórico; alertas geram ordens de serviço no sistema de tickets ITIL  

---

## 📈 Impacto Esperado
- Redução de até **40%** nas paradas não planejadas por falhas digitais  
- Aumento de **5% a 8%** no OEE das linhas de produção  
- Economia anual estimada de **R$ 2,5 a 6 milhões** em grande escala  
- Retorno do investimento em **6 a 12 meses**  

---

## 📌 Status do Projeto
- **Fase atual:** Sprint 0 – visão, escopo, personas e backlog inicial  
- **Início previsto da Sprint 1:** coleta de métricas e protótipo de dashboard  

---

## 👥 Equipe
- **César Araujo** — Product Owner  
- **Davi Santos** — Scrum Master
- **Fernando Silva** — 
- **Isabelly Godoy** — 
- **Victor Nascimento** — 

---

> *Autobotics — protegendo o cérebro da sua produção para manter o coração da fábrica batendo.*
