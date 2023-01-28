module.exports = (sequelize) => {
  const Actor = require("./Actor")(sequelize);
  const Movie = require("./Movie")(sequelize);
  const User = require("./User")(sequelize);

  Actor.belongsToMany(Movie, { through: "Actor_Movie" });
  Movie.belongsToMany(Actor, { through: "Actor_Movie" });

  return {
    Actor,
    Movie,

    User
  }
}
