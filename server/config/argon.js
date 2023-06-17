const { argon2id } = require('argon2');

const ARGON2_DEFAULTS = {
	parallelism: 2,
	memoryCost: 1024,
	version: argon2id,
};

module.exports = { ARGON2_DEFAULTS };
