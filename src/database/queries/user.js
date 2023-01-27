module.exports = (models) => {
    async function findUser(data) {
        return await models.User.findOne({
            where : {
                email : data.email
            }
        });
    }

    async function createUser(data) {
        return await models.User.create(data);
    }

    return {
        findUser,
        createUser
    }
}
