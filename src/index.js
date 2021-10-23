const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const sqlite3 = require("sqlite3").verbose();
const articleRoute = require("./routes/articles");
const authRoute = require("./routes/auth");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/articles", articleRoute);
app.use("/api/auth", authRoute);

module.exports = app;
