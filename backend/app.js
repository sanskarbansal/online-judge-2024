require("dotenv").config();
const express = require("express");
const cors = require("cors"); // Import the cors package
const morgan = require("morgan");

const db = require("./config/db");
const config = require("./config"); // Import the config file
const indexRouter = require("./routes/index");
const app = express();

const { port } = config;

// app.use(morgan(":url :body"));
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", indexRouter);

db.once("open", () => {
    app.listen(port, async () => {});
});
