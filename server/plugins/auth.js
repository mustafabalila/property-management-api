const fastifyPlugin = require('fastify-plugin');
const { TokenExpiredError } = require('jsonwebtoken');

async function auth(fastify, options) {
	/**
	 * Generates a Hash of a user password
	 * @param {string} password
	 * @returns {Promise<string>} The password hash
	 */
	async function generatePasswordHash(password) {
		return fastify.security.generateHash({
			plainText: password,
			secret: fastify.config.PASSWORD_HASHING_SECRET,
		});
	}

	/**
	 * Verifies a user password against a hash
	 * @param {Object} options
	 * @param {string} options.hash
	 * @param {string} options.password
	 * @returns {Promise<boolean>} Verification result
	 */
	async function verifyPasswordHash({ hash, password }) {
		return fastify.security.verifyHash({
			plainText: password,
			hash,
			secret: fastify.config.PASSWORD_HASHING_SECRET,
		});
	}

	/**
	 * Creates an `accessToken` using a `userId`
	 * @param {string} userId
	 * @param {string} roleId
	 * @returns {Promise<string>} `accessToken`
	 */
	async function generateAccessToken(userId) {
		return fastify.security.generateToken({
			payload: { userId, type: 'user' },
			expiresIn: '365d',
		});
	}

	/**
	 * Creates a `refreshToken` using a `userId`
	 * @param {string} userId
	 e @param {string} roleId
	 * @returns {Promise<string>} `refreshToken`
	 */
	async function generateRefreshToken({ userId, roleId }) {
		return fastify.security.generateToken({
			payload: { userId, roleId, type: 'refresh' },
			expiresIn: '365d', // 1 year
		});
	}

	/**
	 * Verifies access credentials before executing the next
	 * callback in a routes' lifecycle
	 * @param {import('fastify').FastifyRequest} request
	 * @param {import('fastify').FastifyReply} reply
	 */
	async function checkForAccessToken(request, reply) {
		const [, token] = request.headers.authorization
			? request.headers.authorization.split(' ')
			: [null, null];
		if (!token) {
			reply.forbidden('Missing credentials');
			return reply;
		}

		const { result, error } = await fastify.security.verifyToken(token);
		if (error) {
			fastify.log.error(error);

			if (error instanceof TokenExpiredError) {
				reply.unauthorized('Credentials expired');
				return reply;
			}

			reply.unauthorized('Invalid credentials');
			return reply;
		}

		const { userId } = result;

		request.requestContext.set('accountId', userId);
	}

	/**
	 * Verifies refresh credentials before executing the next
	 * callback in a routes' lifecycle
	 * @param {import('fastify').FastifyRequest} request
	 * @param {import('fastify').FastifyReply} reply
	 */
	async function checkForRefreshToken(request, reply) {
		const [, token] = request.headers.authorization
			? request.headers.authorization.split(' ')
			: [null, null];
		if (!token) {
			reply.forbidden('Missing credentials');
			return reply;
		}

		const { result, error } = await fastify.security.verifyToken(token);
		if (error) {
			fastify.log.error(error);

			if (error instanceof TokenExpiredError) {
				reply.unauthorized('Credentials expired');
				return reply;
			}

			reply.unauthorized('Invalid credentials');
			return reply;
		}

		const { userId } = result;

		request.requestContext.set('accountId', userId);
	}

	fastify.decorate('auth', {
		generatePasswordHash,
		verifyPasswordHash,
		generateAccessToken,
		generateRefreshToken,
		checkForAccessToken,
		checkForRefreshToken,
	});
}

module.exports = fastifyPlugin(auth, {
	name: 'auth',
	dependencies: ['config'],
});
