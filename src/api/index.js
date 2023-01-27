const express = require("express");
const database = require("../database");
const routes = require("./routes");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.database = database;
app.use(express.json());
app.use(cookieParser());

app.use("/", routes);

// TODO: change PORT to env var
app.listen(3000, () => {
    console.log(`Served started.\nPort: ${3000}`);
});