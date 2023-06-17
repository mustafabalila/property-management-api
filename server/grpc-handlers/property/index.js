const { db } = require('../../db');

/**
 *
 * @param {Object} call grpc call object
 * @param {Number} call.request.page page number
 * @param {Number} call.request.limit number of items per page
 * @param {String} call.request.name building name to search for (optional)
 * @param {String} call.request.city building city to search for (optional)
 * @param {Function} callback grpc callback function
 */
function getProperties() {
	return async (call, callback) => {
		const { page = 1, limit = 15, search, building_id } = call.request;
		const filter = { building_id, search };
		const pagination = { page, limit };
		const order = { field: 'id', direction: 'asc' };

		const {
			rows: [{ properties }],
		} = await db.query('select api.get_properties($1, $2, $3) properties', [
			JSON.stringify(filter),
			JSON.stringify(pagination),
			JSON.stringify(order),
		]);
		callback(null, { list: properties });
	};
}

function getProperty() {
	return async (call, callback) => {
		const id = call.request.id;
		const {
			rows: [{ result }],
		} = await db.query('select api.get_property($1) result', [id]);

		callback(null, { staff: result.property });
	};
}

function createProperty() {
	return async (call, callback) => {
		await db.query('select api.insert_property($1) as result', [
			JSON.stringify(call.request),
		]);

		callback(null, {
			message: 'Property created successfully',
		});
	};
}

function updateProperty() {
	return async (call, callback) => {
		if (!call.request.id) {
			return callback(
				{
					code: 400,
					message: 'ID is required',
				},
				null,
			);
		}

		await db.query('select api.update_property($1) as result', [
			JSON.stringify(call.request),
		]);
		callback(null, {
			message: 'Property updated successfully',
		});
	};
}

function deleteProperty() {
	return async (call, callback) => {
		callback(null, { message: 'Building deleted successfully' });
	};
}

module.exports = {
	getProperties: getProperties(),
	getProperty: getProperty(),
	createProperty: createProperty(),
	updateProperty: updateProperty(),
	deleteProperty: deleteProperty(),
};
