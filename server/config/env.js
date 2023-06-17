const ENV_SCHEMA = {
	type: 'object',
	required: [
		'SERVICE_NAME',
		'REDIS_URL',
		'PG_CONNECTION_STRING',
		'GRPC_HOST',
		'GRPC_PORT',
		'PASSWORD_HASHING_SECRET',
	],

	properties: {
		SERVICE_NAME: {
			type: 'string',
		},
		HOST: {
			type: 'string',
			default: '0.0.0.0',
		},
		PORT: {
			type: 'number',
			default: 3000,
		},
		GRPC_HOST: {
			type: 'string',
			default: '0.0.0.0',
		},
		GRPC_PORT: {
			type: 'number',
			default: 5000,
		},
		APP_ENV: {
			type: 'string',
			enum: ['development', 'staging', 'test', 'production'],
			default: 'development',
		},
		NODE_ENV: {
			type: 'string',
			enum: ['development', 'staging', 'test', 'production'],
			default: 'development',
		},
		LOG_LEVEL: {
			type: 'string',
			enum: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
			default: 'info',
		},
		DISABLE_LOGGING: {
			type: 'boolean',
			default: false,
		},
		REDIS_URL: {
			type: 'string',
		},
		PG_CONNECTION_STRING: {
			type: 'string',
		},
		PASSWORD_HASHING_SECRET: {
			type: 'string',
		},
	},
};

module.exports = { ENV_SCHEMA };
