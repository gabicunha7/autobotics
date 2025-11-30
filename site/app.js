// var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var indexRouter = require("./src/routes/index");
var usuarioRouter = require("./src/routes/usuarios");
var empresasRouter = require("./src/routes/empresas");
var emailRouter = require("./src/routes/email");
var setores = require("./src/routes/setores")

// CRUD FUNCIONARIO

var funcionarioRouter = require("./src/routes/funcionario")
var setorRouter = require("./src/routes/setor")
var parametroRouter = require("./src/routes/parametros")
var controladorRouter = require("./src/routes/controladores")

//Dashboards

var roboticaRouter = require("./src/routes/robotica")
var discoRouter = require("./src/routes/disco")
var manutencaoRouter = require("./src/routes/manutencao")
var historicoAlertasRouter = require("./src/routes/historicoAlerta")
var cpuRam = require("./src/routes/cpuRam")
var s3Router = require("./src/routes/s3Route")
var s3RouteHistoricoAlerta = require("./src/routes/s3RouteHistoricoAlerta")
var s3RouteManutencao = require("./src/routes/s3RouteManutencao")
var s3RouteAlertasTempoReal = require("./src/routes/s3RouteAlertasTempoReal")
var s3RouteCpuRam = require("./src/routes/s3RouteCpuRam")


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/", indexRouter);
app.use("/usuarios", usuarioRouter);
app.use("/empresas", empresasRouter);
app.use("/funcionario", funcionarioRouter);
app.use("/setor", setorRouter);
app.use("/parametros", parametroRouter);
app.use("/controladores", controladorRouter);
app.use("/robotica", roboticaRouter);
app.use("/api", emailRouter);
app.use("/disco", discoRouter);
app.use("/manutencao", manutencaoRouter)
app.use("/historicoAlerta", historicoAlertasRouter);
app.use("/cpuRam", cpuRam)
app.use("/setores", setores)
app.use("/s3Route", s3Router);
app.use("/s3RouteHistoricoAlerta", s3RouteHistoricoAlerta);
app.use("/s3RouteManutencao", s3RouteManutencao)
app.use("/s3RouteAlertasTempoReal", s3RouteAlertasTempoReal)

app.use("/s3RouteCpuRam", s3RouteCpuRam);




app.listen(PORTA_APP, function () {
    console.log(`
    ##   ##  ######   #####             ####       ##     ######     ##              ##  ##    ####    ######  
    ##   ##  ##       ##  ##            ## ##     ####      ##      ####             ##  ##     ##         ##  
    ##   ##  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##        ##   
    ## # ##  ####     #####    ######   ##  ##   ######     ##     ######   ######   ##  ##     ##       ##    
    #######  ##       ##  ##            ##  ##   ##  ##     ##     ##  ##            ##  ##     ##      ##     
    ### ###  ##       ##  ##            ## ##    ##  ##     ##     ##  ##             ####      ##     ##      
    ##   ##  ######   #####             ####     ##  ##     ##     ##  ##              ##      ####    ######  
    
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
