require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const {
  getNotes,
  getNoteByID,
  createNote,
  deleteNote,
  login,
  logout,
  updateNote,
  archieveNote,
} = require("./queries");
const { auth } = require("./middlewares");

const PORT = process.env.SERVER_PORT;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.put("/login", login);
app.put("/logout", logout);

app.get("/notes", getNotes);
app.get("/note/:id", getNoteByID);
app.post("/note", auth, createNote);
app.put("/note/archieve/:id", auth, archieveNote);
app.put("/note/:id", auth, updateNote);
app.delete("/note/:id", auth, deleteNote);

app.get("/", (req, res) => {
  res.status(200).send({
    message:
      "If youdon't know how to use this API, then you should read the documentation",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = {app};