module.exports = (sequelize, models) => {
    async function addMovie(data) {
        const movieCreation = await models.Movie.create({
            title: data.title,
            release_year: data.release_year,
            format: data.format,
        });
        const actorNames = data.actors.map((el) => {
            const names = el.split(" ");
            return {
                firstName: names[0],
                lastName: names[1]
            };
        });
        const actorCreationIfExist = [];
        for (const name of actorNames) {
            const foundActor = await models.Actor.findAll({
                where: {
                    first_name: name.firstName,
                    last_name: name.lastName
                }
            });
            if (!foundActor || !foundActor.length) {
                const actorInfo = await models.Actor.create({
                    first_name: name.firstName,
                    last_name: name.lastName
                });

                await actorInfo.addMovie(movieCreation);
                actorCreationIfExist.push(actorInfo);
            } else {
                actorCreationIfExist.push(foundActor[0].dataValues.id);
            }
        }

        await movieCreation.addActor(actorCreationIfExist);

        return {
            ...movieCreation.dataValues,
            ...actorCreationIfExist,
        };
    }

    async function deleteMovie(data) {
        const deleteMovie = await models.Movie.destroy({
           where: {
               id: data.id
           }
        });

        return deleteMovie;
    }

    async function getMovie(data) {
        const movies = await models.Movie.findAll({
            where: {
                title: data.title,
                release_year: data.year
            },
            include: [{
                model: models.Actor,
                required: false,
                through: { attributes: [] }
            }]
        });

        return movies;
    }

    return {
        addMovie,
        deleteMovie,
        getMovie
    }
}
