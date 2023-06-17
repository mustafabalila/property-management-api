const fastifyPlugin = require('fastify-plugin');
const { hash, verify } = require('argon2');
const { sign: signJwt, verify: verifyJwt } = require('jsonwebtoken');

async function security(fastify, options) {
	/**
	 * Cryptographically hashes plainText
	 * @param {Object} options
	 * @param {string} options.plainText
	 * @param {string} options.secret
	 * @returns {Promise<string>} Hash
	 */
	async function generateHash({ plainText, secret }) {
		return hash(plainText, {
			...fastify.config.ARGON2_DEFAULTS,
			secret: Buffer.from(secret),
		});
	}

	/**
	 * Verifies that a supplied hash is "Cryptographically" equal
	 * to the plainText
	 * @param {Object} options
	 * @param {string} options.plainText
	 * @param {string} options.hash
	 * @param {string} options.secret
	 * @returns {Promise<boolean>}
	 */
	async function verifyHash({ plainText, hash, secret }) {
		return verify(hash, plainText, {
			...fastify.config.ARGON2_DEFAULTS,
			secret: Buffer.from(secret),
		});
	}

	/**
	 * Generates a JWT asynchronously
	 * @param {Object} options
	 * @param {Object} options.payload
	 * @param {string} options.expiresIn
	 * @returns {Promise<string>}
	 */
	async function generateToken({ payload, expiresIn }) {
		try {
			return new Promise(function (resolve, reject) {
				return signJwt(
					{ ...payload },
					fastify.config.TOKEN_HASHING_SECRET,
					{
						expiresIn,
					},
					function (error, result) {
						if (error) {
							return resolve({ result: null, error });
						}

						return resolve({ result, error: null });
					},
				);
			});
		} catch (error) {
			fastify.log.error(error);

			return fastify.httpErrors.internalServerError();
		}
	}

	/**
	 * Verifies a JWT asynchronously
	 * @param {string} token
	 * @returns {Promise<Object>}
	 */
	async function verifyToken(token) {
		try {
			return new Promise(function (resolve, reject) {
				return verifyJwt(
					token,
					fastify.config.TOKEN_HASHING_SECRET,
					{},
					function (error, result) {
						if (error) {
							return resolve({ result: null, error });
						}

						return resolve({ result, error: null });
					},
				);
			});
		} catch (error) {
			fastify.log.error(error);

			return fastify.httpErrors.unauthorized();
		}
	}

	fastify.decorate('security', {
		generateHash,
		verifyHash,
		generateToken,
		verifyToken,
	});
}

module.exports = fastifyPlugin(security, {
	name: 'security',
	dependencies: ['config'],
});
