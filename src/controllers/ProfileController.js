const Profile = require("../model/Profile");

module.exports = {
    index(_request, response) {
        return response.render("profile", {
            profile: Profile.get(),
        });
    },
    update(request, response) {
        // request.body para obter os dados
        const data = request.body;

        // Definir quantas semana tem no ano
        const weeksPerYear = 52;

        // Remover as semanas de férias do ano
        const weeksPerMonth = (weeksPerYear - data["vacation-per-year"]) / 12;

        // Quantas horas por semana estou trabalhando
        const weekTotalHours = data["hours-per-day"] * data["days-per-week"];

        // Total de horas trabalhadas no mês
        const monthlyTotalHours = weeksPerMonth * weekTotalHours;

        // qual será o valor da minha hora
        valueHour = data["monthly-budget"] / monthlyTotalHours;

        Profile.update({
            ...Profile.get(),
            ...data,
            "value-hour": valueHour,
        });
        return response.redirect("/profile");
    },
};
