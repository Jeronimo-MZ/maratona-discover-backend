const Job = require("../model/Job");
const Profile = require("../model/Profile");
const jobUtils = require("../utils/JobUtils");
module.exports = {
    create(_request, response) {
        return response.render("job");
    },
    async save(request, response) {
        // request.body = { name: 'Novo Job', 'daily-hours': '12', 'total-hrs': '2' }

        const job = {
            name: request.body.name,
            "daily-hours": request.body["daily-hours"],
            "total-hours": request.body["total-hours"],
            created_at: Date.now(), // atribuindo data actual
        };

        await Job.create(job);
        return response.redirect("/");
    },
    async show(request, response) {
        const jobs = await Job.get();
        const profile = await Profile.get();

        const jobId = request.params.id;

        const job = jobs.find((job) => Number(job.id) === Number(jobId));

        if (!job) {
            return response.send("Job Not Found").status(404);
        }

        job.budget = jobUtils.calculateBudget(job, profile["value-hour"]);

        return response.render("job-edit", {
            job,
        });
    },
    async update(request, response) {
        const jobId = request.params.id;

        updatedJob = {
            name: request.body.name,
            "total-hours": request.body["total-hours"],
            "daily-hours": request.body["daily-hours"],
        };

        await Job.update(updatedJob, jobId);
        // return response.redirect("/job/" + jobId);
        return response.redirect("/");
    },
    async delete(request, response) {
        const jobId = request.params.id;

        await Job.delete(jobId);
        return response.redirect("/");
    },
};
