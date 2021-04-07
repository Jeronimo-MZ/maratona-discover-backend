let data = [
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
];

module.exports = {
    get() {
        return data;
    },
    update(newData) {
        data = newData;
    },
    delete(id) {
        data = data.filter((job) => Number(job.id) !== Number(id));
    },
    create(newJob) {
        data.push(newJob);
    },
};
