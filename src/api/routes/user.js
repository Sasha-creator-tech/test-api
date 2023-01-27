const express = require("express");
const router = express.Router();
const { header, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const resCodes = require("../../config/resCodes.json");

router.post(
    "/signin",
    header("user-name").isString(),
    header("email").isEmail(),
    header("password").isString(),
    signIn
);

router.post(
    "/login",
    header("email").isEmail(),
    header("password").isString(),
    login
);

async function signIn(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send({ errors: validationErrors.array() });
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const usr = {
        user_name : req.headers["user-name"],
        email : req.headers.email,
        password : await bcrypt.hash(req.headers.password, salt)
    };

    try {
        const createdUser = await res.app.database.createUser(usr);
        return res.status(201).send(createdUser);
    } catch (error) {
        if (error.original.code == "SQLITE_CONSTRAINT") {
            return res.status(409).send(resCodes["409"]);
        }
        return res.status(500).send(resCodes["500"]);
    }
}

async function login(req, res) {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        res.status(400).send({ errors: validationErrors.array() });
        return;
    }

    const user = await res.app.database.findUser({ email: req.headers.email });
    if (user) {
        const password_valid = await bcrypt.compare(req.headers.password, user.password);
        if(password_valid){
            const token = jwt.sign({ "id": user.id, "email": user.email,"user_name": user.user_name }, process.env.SECRET);
            res.cookie("Bearer", token, { httpOnly: true, secure: true, maxAge: 3600000 });
            res.status(200).send({ token });
        } else {
            res.status(400).send({ error : "Password Incorrect" });
        }
    } else {
        res.status(404).send({ error : "User does not exist" });
    }
}

module.exports = router;
