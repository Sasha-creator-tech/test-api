const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    class Actor extends Model {}

    Actor.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: DataTypes.STRING(255),
        last_name: DataTypes.STRING(255)
    }, {
        sequelize,
        modelName: "Actor",
        tableName: "actor",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["first_name", "last_name"]
            }
        ]
    });

    return Actor;
}
