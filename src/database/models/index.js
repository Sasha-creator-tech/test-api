module.exports = (sequelize) => {
  const Actor = require("./Actor")(sequelize);
  const Movie = require("./Movie")(sequelize);
  const ActorMovie = require("./ActorMovie")(sequelize);

  return {
    Actor,
    Movie,
    ActorMovie
  }
}
