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
function getStaffMembers() {
	return async (call, callback) => {
		const { page = 1, limit = 15, search, department_id } = call.request;
		const filter = { department_id, search };
		const pagination = { page, limit };
		const order = { field: 'id', direction: 'asc' };

		const {
			rows: [{ members }],
		} = await db.query('select api.get_staff_members($1, $2, $3) members', [
			JSON.stringify(filter),
			JSON.stringify(pagination),
			JSON.stringify(order),
		]);
		callback(null, { list: members });
	};
}

function getStaffMember() {
	return async (call, callback) => {
		const id = call.request.id;
		const {
			rows: [{ result }],
		} = await db.query('select api.get_staff_member($1) result', [id]);

		callback(null, { staff: result.member });
	};
}

function createStaffMember() {
	return async (call, callback) => {
		await db.query('select api.insert_staff_member($1) as result', [
			JSON.stringify(call.request),
		]);

		callback(null, {
			message: 'Staff member created successfully',
		});
	};
}

function updateStaffMember() {
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
		await db.query('select api.update_staff_member($1) as result', [
			JSON.stringify(call.request),
		]);
		callback(null, {
			message: 'Staff member updated successfully',
		});
	};
}

function deleteStaffMember() {
	return async (call, callback) => {
		callback(null, { message: 'Building deleted successfully' });
	};
}

module.exports = {
	getStaffMembers: getStaffMembers(),
	getStaffMember: getStaffMember(),
	createStaffMember: createStaffMember(),
	updateStaffMember: updateStaffMember(),
	deleteStaffMember: deleteStaffMember(),
};
