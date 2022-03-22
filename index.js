const express = require('express')
var bodyParser = require('body-parser');
const fs = require("fs");
const { getNotes, getNoteByID, createNote, deleteNote } = require('./queries')
const PORT = 3000

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.get("/notes/:id", getNoteByID)
app.get("/notes", getNotes)
app.post("/note", createNote)
app.delete("/note/:id", deleteNote)
app.get("/", (req, res) => {
    res.status(200).send({"message": "If youdon't know how to use this API, then you should read the documentation"})
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

