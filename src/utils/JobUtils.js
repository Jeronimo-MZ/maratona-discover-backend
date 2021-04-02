module.exports = {
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
        const dayDifference = Math.floor(timeDifferenceInMillis / dayInMillis);

        // restam x dias
        return dayDifference;
    },
    calculateBudget(job, valueHour) {
        return valueHour * job["total-hours"];
    },
};
