const jwt = require("jsonwebtoken");

module.exports = (req) => {
    try {
        const token = req.headers['authorization'].split(" ")[1];
        jwt.verify(token, process.env.SECRET);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}