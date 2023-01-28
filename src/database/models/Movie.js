const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Movie extends Model {}

    Movie.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: DataTypes.STRING(50),
        release_year: DataTypes.INTEGER,
        format: DataTypes.STRING(8)
    }, {
        sequelize,
        modelName: "Movie",
        tableName: "movie",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["title", "release_year", "format"]
            }
        ]
    });

    return Movie;
}
