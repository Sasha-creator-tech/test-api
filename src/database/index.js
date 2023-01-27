const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("movie-db", "user", "pass", {
    dialect: "sqlite",
    host: "./data.sqlite"
});

sequelize.sync().then(() => console.log(`database is synchronised...`));

const models = require("./models")(sequelize);
const queries = require("./queries")(models);

module.exports = queries;
