const Job = require("../model/Job");
const Profile = require("../model/Profile");
const jobUtils = require("../utils/JobUtils");

module.exports = {
    async index(_request, response) {
        const jobs = await Job.get();
        const profile = await Profile.get();

        const statusCount = {
            progress: 0,
            done: 0,
            total: jobs.length,
        };
        // total de horas por dia em cada job em progresso
        let jobTotalHours = 0;

        const updatedJobs = jobs.map((job) => {
            // ajustes no job
            const remaining = jobUtils.calcRemainingDays(job);
            const status = remaining <= 0 ? "done" : "progress";
            const budget = jobUtils.calculateBudget(job, profile["value-hour"]);

            // somando a quantidade de status
            statusCount[status]++;

            // horas por dia - horas trabalhadas por dia
            jobTotalHours +=
                status == "progress" ? Number(job["daily-hours"]) : 0;

            return {
                ...job,
                remaining,
                status,
                budget,
            };
        });

        // horas por dia - horas trabalhadas por dia
        const freeHours = profile["hours-per-day"] - jobTotalHours;

        return response.render("index", {
            jobs: updatedJobs,
            profile,
            statusCount,
            freeHours,
        });
    },
};
