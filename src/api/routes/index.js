const express = require("express");
const { header, body, query, validationResult } = require("express-validator");
const router = express.Router();
const config = require("../../config/config.json");
const resCodes = require("../../config/resCodes.json");

//***ROUTES***
//Add new movies
// TODO: add authorisation
router.post(
    "/movie",
    body("title").isString(),
    body("release_year").isInt({ min: 1800, max: 2100 }),
    body("format").custom(function (value) {
        if (config.movieFormats.includes(value)) {
            return true;
        }
    }),
    body("actors").isArray(),
    addMovie
);

router.delete(
    "/movie",
    body("id").isInt(),
    deleteMovie
)

router.get(
    "/movie",
    query("title").isString(),
    query("year").isInt({ min: 1800, max: 2100 }),
    getMovie
);

//***FUNCTIONS***
async function addMovie(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send({ errors: validationErrors.array() });
        return;
    }

    const data = req.body;
    try {
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
        await res.app.database.deleteMovie(data);
        return res.sendStatus(200);
    } catch (error) {
        console.log(error);
        return res.status(500).send(resCodes["500"]);
    }
}

async function getMovie(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send({ errors: validationErrors.array() });
        return;
    }

    try {
        const moviesResult = await res.app.database.getMovie(req.query);
        return res.status(200).send(moviesResult);
    } catch (error) {
        console.log(error);
        return res.status(500).send(resCodes["500"]);
    }
}

module.exports = router;
