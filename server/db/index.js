const pg = require('pg');
const config = {
	connectionString: process.env.PG_CONNECTION_STRING,
	ssl: false,
}

const connection = new pg.Pool(config);

module.exports = {
	db: connection,
};