require('make-promises-safe');
const closeWithGrace = require('close-with-grace');
const { bootstrap } = require('./server');
const Knex = require('knex');

const { HOST = '0.0.0.0', PORT = 3000 } = process.env;

let server;
/**
 * Starts the API service
 */
async function start() {
	try {
		// Bootstrap the server
		server = await bootstrap();

    server.addHook('onClose', (instance, done) => {
      closeListeners.uninstall();
      done()
    })
		// Catch and log any errors that occur during plugin registration
		await server.ready().catch(err => server.log.error(err));
    
		// Start listening for requests
		await server
			.listen({ port: PORT, host: HOST })
			.catch(err => server.log.error(err));

		server.log.debug(server.printRoutes());
		server.log.info('Ready');
	} catch (err) {
		// Log any uncaught startup errors
		console.error(err);
	}
}

start();


const closeListeners = closeWithGrace(
  { delay: 500 },
  async function ({ signal, err, manual }) {
    if (err) {
      server.log.error(err);
    }
    server.log.info('Closing server...');
    await server.close();
  },
);
