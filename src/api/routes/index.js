const express = require("express");
const { header, body, validationResult } = require("express-validator");
const router = express.Router();
const config = require("../../config/config.json");
const resCodes = require("../../config/resCodes.json");

//***ROUTES***
//Add new movies
// TODO: add authorisation
router.post(
    "/movie",
    body("title").isString(),
    body("release_year").isInt(),
    body("format").custom(function (value) {
        if (config.movieFormats.includes(value)) {
            return true;
        }
    }),
    body("actors").isArray(),
    addMovie
);

router.delete(
    "/",
    body("id").isInt(),
    deleteMovie
)

//***FUNCTIONS***
async function addMovie(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send({ errors: validationErrors.array() });
        return;
    }

    const data = req.body;
    try {
        // TODO: say user if current row already exists
        const newMovieResult = await res.app.database.addMovie(data);
        return res.status(200).send(newMovieResult);
    } catch (error) {
        console.log(error);
        return res.status(500).send(resCodes["500"]);
    }
}

async function deleteMovie(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send({ errors: validationErrors.array() });
        return;
    }

    const data = req.body;
    try {
        const removeMovieResult = await res.app.database.deleteMovie(data);
        return res.status(200).send(removeMovieResult);
    } catch (error) {
        console.log(error);
        return res.status(500).send(resCodes["500"]);
    }
}

module.exports = router;
