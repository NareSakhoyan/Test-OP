const dotenv = require('dotenv');
const path = require('path');

console.log(process.env.NODE_ENV)

dotenv.config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV}.env`)
});

module.exports = {
    NODE_ENV : process.env.NODE_ENV,
    DB_USER : process.env.DB_USER,
    DB_HOST : process.env.DB_HOST,
    DB_DATABASE : process.env.DB_DATABASE,
    DB_PASSWORD : process.env.DB_PASSWORD,
    DB_PORT : process.env.DB_PORT,
    SERVER_PORT : process.env.SERVER_PORT,
}