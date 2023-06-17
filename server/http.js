const fastify = require('fastify');
const path = require('path');
const { SERVER_CONFIG } = require('./config/server');
const ajv = require('./config/ajv');

/**
 * Bootstraps the API service
 * @returns {Promise<import('fastify').FastifyInstance>}
 */
async function bootstrap() {
	// Initialize the server
	const server = fastify(SERVER_CONFIG);

	// Use a custom schema validator
	server.setValidatorCompiler(function ({ schema }) {
		return ajv.compile(schema);
	});

	// Standardize HTTP error responses
	await server.register(require('@fastify/sensible'));

	// Request-scoped asynchronous storage
	await server.register(
		require('@fastify/request-context').fastifyRequestContextPlugin,
		{
			defaultStoreValues: {
				accessToken: null,
				refreshToken: null,
				account: {},
			},
		},
	);

	// Load environment variables and configuration options
	await server.register(require('./plugins/config'));

	// Sane default HTTP headers
	await server.register(require('@fastify/helmet'), {
		contentSecurityPolicy: false,
	});
	await server.register(require('@fastify/cors'));
	// Cryptography essentials
	await server.register(require('./plugins/security'));

	// Enable multipart request body
	await server.register(require('@fastify/multipart'));

	// Load DB client and initialize models
	await server.register(require('./plugins/db'));

	// // Load Cache client
	await server.register(require('./plugins/cache'));

	// // Enable user authentication
	await server.register(require('./plugins/auth'));

	// Enable static file serving
	await server.register(require('@fastify/static'), {
		root: path.join(__dirname, 'static'),
	});

	// Enable healthchecks
	await server.register(require('./plugins/underPressure'));

	// Enable rate-limiter
	await server.register(require('./plugins/rateLimiting'));

	// Enable general helper utilities
	await server.register(require('./plugins/helpers'));

	// Register application routes
	await server.register(require('./routes'), { prefix: 'api' });

	return server;
}

module.exports = { bootstrap };
