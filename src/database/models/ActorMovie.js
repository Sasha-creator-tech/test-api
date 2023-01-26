const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class ActorMovie extends Model {}

    ActorMovie.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        movie_id: DataTypes.INTEGER,
        actor_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: "ActorMovie",
        tableName: "actor_movie",
        timestamps: false
    });

    ActorMovie.associate = (models) => {
        ActorMovie.belongsTo(models.Actor, {
            foreignKey: "actor_id"
        });
        ActorMovie.belongsTo(models.Movie, {
            foreignKey: "movie_id"
        });
    }

    return ActorMovie;
}
