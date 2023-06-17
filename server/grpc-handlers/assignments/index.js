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
function getAssignments() {
	return async (call, callback) => {
		const {
			page = 1,
			limit = 15,
			property_id,
			department_id,
			member_id,
			status,
			start_date,
			end_date,
		} = call.request;
		const filter = {
			property_id,
			department_id,
			member_id,
			status,
			start_date,
			end_date,
		};
		const pagination = { page, limit };
		const order = { field: 'id', direction: 'asc' };

		const {
			rows: [{ assignments }],
		} = await db.query('select api.get_assignments($1, $2, $3) assignments', [
			JSON.stringify(filter),
			JSON.stringify(pagination),
			JSON.stringify(order),
		]);
		callback(null, { list: assignments });
	};
}

function getAssignment() {
	return async (call, callback) => {
		const id = call.request.id;
		const {
			rows: [{ result }],
		} = await db.query('select api.get_assignment($1) result', [id]);

		callback(null, { staff: result.assignment });
	};
}

function createAssignment() {
	return async (call, callback) => {
		await db.query('select api.insert_assignment($1) as result', [
			JSON.stringify(call.request),
		]);

		callback(null, {
			message: 'Assignment created successfully',
		});
	};
}

function updateAssignment() {
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

		await db.query('select api.update_assignment($1) as result', [
			JSON.stringify(call.request),
		]);
		callback(null, {
			message: 'Assignment updated successfully',
		});
	};
}

function deleteAssignment() {
	return async (call, callback) => {
		callback(null, { message: 'Building deleted successfully' });
	};
}

module.exports = {
	getAssignments: getAssignments(),
	getAssignment: getAssignment(),
	createAssignment: createAssignment(),
	updateAssignment: updateAssignment(),
	deleteAssignment: deleteAssignment(),
};
