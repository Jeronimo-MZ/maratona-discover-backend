const { render } = require("ejs");
const express = require("express");
const path = require("path");
const VIEWS_PATH = path.resolve(__dirname, "views");

const routes = express.Router();

const Profile = {
    data: {
        name: "Jerónimo Matavel",
        avatar: "https://github.com/jeronimo-mz.png",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75,
    },
    controllers: {
        index(_request, response) {
            return response.render(path.resolve(VIEWS_PATH, "profile"), {
                profile: Profile.data,
            });
        },
        update(request, response) {
            // request.body para obter os dados
            const data = request.body;

            // Definir quantas semana tem no ano
            const weeksPerYear = 52;

            // Remover as semanas de férias do ano
            const weeksPerMonth =
                (weeksPerYear - data["vacation-per-year"]) / 12;

            // Quantas horas por semana estou trabalhando
            const weekTotalHours =
                data["hours-per-day"] * data["days-per-week"];

            // Total de horas trabalhadas no mês
            const monthlyTotalHours = weeksPerMonth * weekTotalHours;

            // qual será o valor da minha hora
            valueHour = data["monthly-budget"] / monthlyTotalHours;

            Profile.data = {
                ...Profile.data,
                ...data,
                "value-hour": valueHour,
            };
            return response.redirect("/profile");
        },
    },
};

const Job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 60,
            created_at: Date.now(), // atribuindo data actual
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 2,
            "total-hours": 1,
            created_at: Date.now(), // atribuindo data actual
        },
    ],
    controllers: {
        index(_request, response) {
            const updatedJobs = Job.data.map((job) => {
                // ajustes no job
                const remaining = Job.services.calcRemainingDays(job);
                const status = remaining <= 0 ? "done" : "progress";
                const budget = Job.services.calculateBudget(
                    job,
                    Profile.data["value-hour"]
                );

                return {
                    ...job,
                    remaining,
                    status,
                    budget,
                };
            });

            return response.render(path.resolve(VIEWS_PATH, "index"), {
                jobs: updatedJobs,
            });
        },
        create(_request, response) {
            return response.render(path.resolve(VIEWS_PATH, "job"));
        },
        save(request, response) {
            // request.body = { name: 'Novo Job', 'daily-hours': '12', 'total-hrs': '2' }
            const jobId = Job.data[Job.data.length - 1]?.id + 1 || 1;

            const job = {
                id: jobId,
                name: request.body.name,
                "daily-hours": request.body["daily-hours"],
                "total-hours": request.body["total-hours"],
                created_at: Date.now(), // atribuindo data actual
            };

            Job.data.push(job);
            return response.redirect("/");
        },
        show(request, response) {
            const jobId = request.params.id;

            const job = Job.data.find(
                (job) => Number(job.id) === Number(jobId)
            );

            if (!job) {
                return response.send("Job Not Found").status(404);
            }

            job.budget = Job.services.calculateBudget(
                job,
                Profile.data["value-hour"]
            );

            return response.render(path.resolve(VIEWS_PATH, "job-edit"), {
                job,
            });
        },
        update(request, response) {
            const jobId = request.params.id;

            const job = Job.data.find(
                (job) => Number(job.id) === Number(jobId)
            );

            if (!job) {
                return response.send("Job Not Found").status(404);
            }

            updatedJob = {
                ...job,
                name: request.body.name,
                "total-hours": request.body["total-hours"],
                "daily-hours": request.body["daily-hours"],
            };

            Job.data = Job.data.map((job) => {
                if (Number(job.id) === Number(jobId)) {
                    job = updatedJob;
                }

                return job;
            });
            return response.redirect("/job/" + jobId);
        },
        delete(request, response) {
            const jobId = request.params.id;

            Job.data = Job.data.filter(
                (job) => Number(job.id) !== Number(jobId)
            );
            return response.redirect("/");
        },
    },
    services: {
        calcRemainingDays(job) {
            // calculo do tempo restante
            const remainingDays = (
                job["total-hours"] / job["daily-hours"]
            ).toFixed();

            const createdDate = new Date(job.created_at);
            const dueDay = createdDate.getDate() + Number(remainingDays);
            const dueDateInMillis = createdDate.setDate(dueDay);

            const timeDifferenceInMillis = dueDateInMillis - Date.now();

            // transformar Milissegundos em dias
            const dayInMillis = 1000 * 60 * 60 * 24;
            //                  1000ms 60s  60m  24h
            const dayDifference = Math.floor(
                timeDifferenceInMillis / dayInMillis
            );

            // restam x dias
            return dayDifference;
        },
        calculateBudget(job, valueHour) {
            return valueHour * job["total-hours"];
        },
    },
};

routes.get("/", Job.controllers.index);

routes.get("/job", Job.controllers.create);

routes.post("/job", Job.controllers.save);

routes.get("/job/:id", Job.controllers.show);
routes.post("/job/:id", Job.controllers.update);
routes.post("/job/delete/:id", Job.controllers.delete);

routes.get("/profile", Profile.controllers.index);
routes.post("/profile", Profile.controllers.update);

module.exports = routes;
