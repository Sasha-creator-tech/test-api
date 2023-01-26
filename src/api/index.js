const express = require("express");
const database = require("../database");
const routes = require("./routes");

const app = express();

app.database = database;
app.use(express.json());

app.use("/", routes);

// TODO: change PORT to env var
app.listen(3000, () => {
    console.log(`Served started.\nPort: ${3000}`);
});