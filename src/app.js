require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const articlesRouter = require("./articles/article-router");

const app = express();

app.use(morgan(NODE_ENV === "production" ? "tiny" : "common"));
app.use(cors());
app.use(helmet());

app.use("/api/articles", articlesRouter);

app.get("/xss", (req, res) => {
  res.cookie("secretToken", "1234567890");
  res.sendFile(__dirname + "/xss-example.html");
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: "Server error" };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
