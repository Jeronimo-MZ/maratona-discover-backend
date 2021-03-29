const express = require("express");
const path = require("path");
const VIEWS_PATH = path.resolve(__dirname, "views");

const routes = express.Router();

const profile = {
    name: "Jerónimo Matavel",
    avatar: "https://github.com/jeronimo-mz.png",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
};
routes.get("/", (request, response) => {
    return response.render(path.resolve(VIEWS_PATH, "index"));
});

routes.get("/job", (request, response) => {
    return response.render(path.resolve(VIEWS_PATH, "job"));
});

routes.get("/job/edit", (request, response) => {
    return response.render(path.resolve(VIEWS_PATH, "job-edit"));
});

routes.get("/profile", (request, response) => {
    return response.render(path.resolve(VIEWS_PATH, "profile"), { profile });
});

module.exports = routes;
