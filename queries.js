const Pool = require('pg').Pool
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'api',
  password: 'admin_pass',
  port: 5432,
})

const getNotes = (request, response) => {
    pool.query('SELECT * FROM notes ORDER BY id ASC', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const getNoteByID = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM notes WHERE id = $1', [id], (error, results) => {
        if (error) {
            throw error
        }
        response.status(201).json(results.rows)
    })
}

const createNote = (request, response) => {
    const { title, idDone = false } = request.body

    pool.query('INSERT INTO notes (title, isDone) VALUES ($1, $2) RETURNING *', [title, idDone], (error, results) => {
        if (error) {
            throw error
        }
        console.log(results)
        response.status(201).send(results.rows[0])
    })
}


const deleteNote = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM notes WHERE id = $1 RETURNING *', [id], (error, results) => {
      if (error) {
        throw error
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
}