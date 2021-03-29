const express = require("express");
const routes = require("./routes");

const server = express();
const PORT = 3001;

server.set("view engine", "ejs");

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
