const express = require("express");
const { body, header, query, validationResult } = require("express-validator");
const router = express.Router();
const config = require("../../config/config.json");
const resCodes = require("../../config/resCodes.json");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const user = require("./user");
const auth = require("../middleware/index");

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
    header("authorization").isString(),
    deleteMovie
)

router.get(
    "/movie",
    query("title").isString(),
    query("year").isInt({ min: 1800, max: 2100 }),
    getMovie
);

router.get(
  "/movies",
    query("titleOrder").optional().custom(function (value) {
      if (["ASC", "DESC"].includes(value)) {
          return true;
      }
    }),
    query("title").optional().isString(),
    query("actor").optional().isString(),
    getMovies
);

router.post(
    "/importMovieFromFile",
    upload.single("movies"),
    importMoviesFile
);

//***FUNCTIONS***
async function addMovie(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send({ errors: validationErrors.array() });
        return;
    }
    if (!auth(req)) return res.status(401).send({ status: 401, message: "Couldn't Authenticate" });

    const data = req.body;
    try {
        const newMovieResult = await res.app.database.addMovie(data);
        return res.status(200).send(newMovieResult);
    } catch (error) {
        if (error.original.code == "SQLITE_CONSTRAINT") {
            return res.status(409).send(resCodes["409"]);
        }
        return res.status(500).send(resCodes["500"]);
    }
}

async function deleteMovie(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send({ errors: validationErrors.array() });
        return;
    }
    if (!auth(req)) return res.status(401).send({ status: 401, message: "Couldn't Authenticate" });

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

async function getMovies(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send({ errors: validationErrors.array() });
        return;
    }

    try {
        const moviesResult = await res.app.database.getMovies(req.query);
        return res.status(200).send(moviesResult);
    } catch (error) {
        console.log(error);
        return res.status(500).send(resCodes["500"]);
    }
}

async function importMoviesFile(req, res) {
    const file = req.file;
    if (!file) {
        const error = new Error("Please upload a file");
        return res.status(400).send(error);
    }
    if (!auth(req)) return res.status(401).send({ status: 401, message: "Couldn't Authenticate" });

    const multerText = Buffer.from(file.buffer).toString("utf-8");

    try {
        const rowsMovies = multerText.split("\n\n");
        const filmsImportRes = [];
        for (const row of rowsMovies) {
            if (row == "") continue;
            const movie = {};
            const data = row.split("\n");
            for (const property of data) {
                if (property.split("Title: ")[1]) {
                    movie.title = property.split("Title: ")[1];
                } else if (property.split("Release Year: ")[1]) {
                    movie.release_year = property.split("Release Year: ")[1];
                } else if (property.split("Format: ")[1]) {
                    movie.format = property.split("Format: ")[1];
                } else if (property.split("Stars: ")[1]) {
                    movie.actors = property.split("Stars: ")[1].split(", ");
                }
            }

            filmsImportRes.push(await res.app.database.addMovie(movie));
        }

        res.status(200).send(filmsImportRes);
    } catch (error) {
        console.log(error);
        return res.status(500).send(resCodes["500"]);
    }
}

router.use("/user", user);

module.exports = router;
