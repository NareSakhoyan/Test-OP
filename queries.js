const res = require('express/lib/response')

const Pool = require('pg').Pool

const DB_USER = process.env.DB_USER 
const DB_HOST = process.env.DB_HOST 
const DB_DATABASE = process.env.DB_DATABASE 
const DB_PASSWORD = process.env.DB_PASSWORD 
const DB_PORT = process.env.DB_PORT


const pool = new Pool({
  user: DB_USER,
  host: DB_HOST,
  database: DB_DATABASE,
  password: DB_PASSWORD,
  port: DB_PORT,
})

const getNotes = (request, response) => {
    pool.query('SELECT * FROM notes ORDER BY id ASC', (error, results) => {
        if (error) {
            response.status(400).send({"error": error.message})
            return;
        }
        response.status(200).json(results.rows)
    })
}

const getNoteByID = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT title, isDone FROM notes WHERE id = $1', [id], (error, results) => {
        if (error) {
            response.status(400).send({"error": error.message})
            return;
        }
        response.status(201).json(results.rows)
    })
}

const createNote = (request, response) => {
    const { title, idDone = false } = request.body

    pool.query('INSERT INTO notes (title, isDone) VALUES ($1, $2) RETURNING *', [title, idDone], (error, results) => {
        if (error) {
            response.status(400).send({"error": error.message})
            return;
        }
        response.status(201).send(results.rows[0])
    })
}


const deleteNote = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM notes WHERE id = $1 RETURNING *', [id], (error, results) => {
      if (error) {
        response.status(400).send({"error": error.message})
        return;
      }
      if (results.rowCount == 0) {
          response.status(200).send({"message": "Not a note with specified id"})
          return;
      }
      response.status(200).send(results.rows)
    })
  }

module.exports = {
    getNotes,
    getNoteByID,
    createNote,
    deleteNote
};