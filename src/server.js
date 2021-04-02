const express = require("express");
const routes = require("./routes");
const path = require("path");
const server = express();
const PORT = 3001;

// usar o request.body
server.use(express.urlencoded());

// usando template engine, no caso, ejs
server.set("view engine", "ejs");

// mudar a localização das views
server.set("views", path.resolve(__dirname, "views"));

// habilitar arquivos estáticos
server.use(express.static("public"));

// imprimir dados da requisição no terminal
function logRequests(request, response, next) {
    const { method, url } = request;
    console.log(`[${method}]: ${url}`);

    return next();
}
server.use(logRequests);

// configurando as rotas
server.use(routes);

// iniciado o servidor
server.listen(PORT, () => {
    console.log("🚀Backend started at http://localhost:" + String(PORT));
});
