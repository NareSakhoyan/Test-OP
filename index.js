require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');

const {
  getNotes,
  getNoteByID,
  createNote,
  deleteNote,
  login,
  logout,
} = require("./queries");
const res = require("express/lib/response");
const { user } = require("pg/lib/defaults");

const PORT = process.env.SERVER_PORT;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  "/note",
  (request, response, next) => {
    const token = request.headers.authorization.split(' ')[1];
    if (token) {
      jwt.verify(token, "LOLIPOP", function (err, decoded) {
        next();
      });
    } else response.status(403).send({ error: "You are not authorized" });
  },
  (req, res, next) => {
    console.log("Request Type:", req.method);
    next();
  }
);

app.get("/notes", getNotes);
app.put("/login", login);
app.put("/logout", logout);
app.get("/note/:id", getNoteByID);
app.post("/note", createNote);
app.delete("/note/:id", deleteNote);
app.get("/", (req, res) => {
  res.status(200).send({
    message:
      "If youdon't know how to use this API, then you should read the documentation",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
