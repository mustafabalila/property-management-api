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
function getBuildings() {
	return async (call, callback) => {
		console.log(call.request);
		const { page = 1, limit = 15, name, city } = call.request;
		const filter = { name, city };
		const pagination = { page, limit };
		const order = { field: 'id', direction: 'asc' };

		const {
			rows: [{ buildings }],
		} = await db.query('select api.get_buildings($1, $2, $3) buildings', [
			JSON.stringify(filter),
			JSON.stringify(pagination),
			JSON.stringify(order),
		]);

		callback(null, { list: buildings });
	};
}

function getBuilding() {
	return async (call, callback) => {
		const buildingID = call.request.id;
		const {
			rows: [{ result }],
		} = await db.query('select api.get_building($1) result', [buildingID]);

		callback(null, { building: result.building });
	};
}

function createBuilding() {
	return async (call, callback) => {
		await db.query('select api.insert_building($1) as result', [
			JSON.stringify(call.request),
		]);

		callback(null, {
			message: 'Building created successfully',
		});
	};
}

function updateBuilding() {
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
		await db.query('select api.update_building($1) as result', [
			JSON.stringify(call.request),
		]);
		callback(null, {
			message: 'Building updated successfully',
		});
	};
}

function deleteBuilding() {
	return async (call, callback) => {
		callback(null, { message: 'Building deleted successfully' });
	};
}

module.exports = {
	getBuildings: getBuildings(),
	getBuilding: getBuilding(),
	createBuilding: createBuilding(),
	updateBuilding: updateBuilding(),
	deleteBuilding: deleteBuilding(),
};
