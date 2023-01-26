module.exports = (sequelize, models) => {
    async function addMovie(data) {
        const movieCreation = await models.Movie.create({
            title: data.title,
            release_year: data.release_year,
            format: data.format
        });

        const actorNames = data.actors.map((el) => {
            const names = el.split(" ");
            return {
                firstName: names[0],
                lastName: names[1]
            };
        });

        const actorCreationIfExist = [];
        const actorMovieCreation = [];
        //save actors and associate them with movies
        for (const name of actorNames) {
            const actorInfo = await models.Actor.findOrCreate({
                where: {
                    first_name: name.firstName,
                    last_name: name.lastName
                }
            });
            actorCreationIfExist.push(actorInfo);

            actorMovieCreation.push(await models.ActorMovie.findOrCreate({
                where: {
                    movie_id: movieCreation.dataValues.id,
                    actor_id: actorInfo[0].dataValues.id
                }
            }));
        }

        return {
            ...movieCreation.dataValues,
            ...actorCreationIfExist,
            ...actorCreationIfExist
        };
    }

    async function deleteMovie(data) {
        // TODO: remove movie and actor if association doesn't exists
    }

    return {
        addMovie,
        deleteMovie
    }
}
