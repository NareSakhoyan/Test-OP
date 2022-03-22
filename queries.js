const res = require("express/lib/response");
const jwt = require("jsonwebtoken");

const Pool = require("pg").Pool;

const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_DATABASE = process.env.DB_DATABASE;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_PORT = process.env.DB_PORT;

const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
});

const getNotes = (request, response) => {
  pool.query("SELECT * FROM notes ORDER BY id ASC", (error, results) => {
    if (error) {
      response.status(400).send({ error: error.message });
      return;
    }
    response.status(200).json(results.rows);
  });
};

const getNoteByID = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT title, isDone FROM notes WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        response.status(400).send({ error: error.message });
        return;
      }
      response.status(201).json(results.rows);
    }
  );
};

const createNote = (request, response) => {
  const { title, idDone = false } = request.body;

  pool.query(
    "INSERT INTO notes (title, isDone) VALUES ($1, $2) RETURNING *",
    [title, idDone],
    (error, results) => {
      if (error) {
        response.status(400).send({ error: error.message });
        return;
      }
      response.status(201).send(results.rows[0]);
    }
  );
};

const deleteNote = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "DELETE FROM notes WHERE id = $1 RETURNING *",
    [id],
    (error, results) => {
      if (error) {
        response.status(400).send({ error: error.message });
        return;
      }
      if (results.rowCount == 0) {
        response.status(200).send({ message: "Not a note with specified id" });
        return;
      }
      response.status(200).send(results.rows);
    }
  );
};

const login = (request, response) => {
  const { username } = request.body;

  //this could be a hash, but for now I'm letting a basic string
  const session = Date.now() + "username";

  pool.query(
    "UPDATE users SET activesession = $1 RETURNING *",
    [session],
    (error, results) => {
      if (error) {
        response.status(400).send({ error: error.message });
        return;
      }
      const token = jwt.sign(results.rows[0], "LOLIPOP");
      response
        .status(400)
        .send({ message: "You are logged in, keep this token safe", token });
    }
  );
};

const logout = (request, response) => {
  const { username } = request.body;

  pool.query(
    "UPDATE users SET activesession = $1 RETURNING *",
    [null],
    (error, results) => {
      if (error) {
        response.status(400).send({ error: error.message });
        return;
      }
      response.status(201).send({ message: "User logged out successfully" });
    }
  );
};

module.exports = {
  getNotes,
  getNoteByID,
  createNote,
  deleteNote,
  login,
  logout,
};
