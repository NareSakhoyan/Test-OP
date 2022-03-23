const res = require("express/lib/response");
const jwt = require("jsonwebtoken");

const Pool = require("pg").Pool;

const {
  DB_USER,
  DB_HOST,
  DB_DATABASE,
  DB_PASSWORD,
  DB_PORT,
} = require('./configs')


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
    "SELECT title, isDone FROM notes WHERE id = $1 and status != 'deleted'",
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
  const { title, isDone = false } = request.body;

  //data validation
  const errorsList = {"validation errors": []}
  if (typeof(title) !== "string"  ) {
    errorsList["validation errors"].push("title property should be string type")
    if (!typeof(isDone) !== "boolean") {
      errorsList["validation errors"].push("isDone property should be boolean type")
    }
    request.status(403).send(errorsList)
    // throw error
  }
  pool.query(
    "INSERT INTO notes (title, isDone) VALUES ($1, $2) RETURNING *",
    [title, isDone],
    (error, results) => {
      if (error) {
        response.status(400).send({ error: error.message });
        return;
      }
      response.status(201).send(results.rows[0]);
    }
  );
};

const updateNote = (request, response) => {
  const id = parseInt(request.params.id);
  const { title, isDone } = request.body;

  pool.query(
    "UPDATE notes SET title = $1, isDone = $2 WHERE id = $3 RETURNING *",
    [title, isDone, id],
    (error, results) => {
      if (error) {
        response.status(400).send({ error: error.message });
        return;
      }
      response.status(201).send(results.rows[0]);
    }
  );
};

const archieveNote = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "UPDATE notes SET status = $1 WHERE id = $2 RETURNING *",
    ["archieved", id],
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

const deleteNote = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "UPDATE notes SET status = $1 WHERE id = $2 RETURNING *",
    ["deleted", id],
    (error, results) => {
      if (error) {
        response.status(400).send({ error: error.message });
        return;
      }
      if (results.rowCount == 0) {
        response.status(200).send({ message: "N ot a note with specified id" });
        return;
      }
      response.status(200).send(results.rows);
    }
  );
};

const permanentlyDeleteNote = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query(
    "DELETE FROM notes WHERE id = $3 RETURNING *",
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
  updateNote,
  archieveNote,
};
