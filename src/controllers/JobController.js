const Job = require("../model/Job");
const Profile = require("../model/Profile");
const jobUtils = require("../utils/JobUtils");
module.exports = {
    create(_request, response) {
        return response.render("job");
    },
    save(request, response) {
        // request.body = { name: 'Novo Job', 'daily-hours': '12', 'total-hrs': '2' }
        const jobs = Job.get();
        const jobId = jobs[jobs.length - 1]?.id + 1 || 1;

        const job = {
            id: jobId,
            name: request.body.name,
            "daily-hours": request.body["daily-hours"],
            "total-hours": request.body["total-hours"],
            created_at: Date.now(), // atribuindo data actual
        };

        Job.update([...jobs, job]);
        return response.redirect("/");
    },
    show(request, response) {
        const jobs = Job.get();
        const profile = Profile.get();

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
    update(request, response) {
        const jobs = Job.get();

        const jobId = request.params.id;

        const job = jobs.find((job) => Number(job.id) === Number(jobId));

        if (!job) {
            return response.send("Job Not Found").status(404);
        }

        updatedJob = {
            ...job,
            name: request.body.name,
            "total-hours": request.body["total-hours"],
            "daily-hours": request.body["daily-hours"],
        };

        Job.update(
            jobs.map((job) => {
                if (Number(job.id) === Number(jobId)) {
                    job = updatedJob;
                }

                return job;
            })
        );
        // return response.redirect("/job/" + jobId);
        return response.redirect("/");
    },
    delete(request, response) {
        const jobId = request.params.id;

        Job.delete(jobId);
        return response.redirect("/");
    },
};
