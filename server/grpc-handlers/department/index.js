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
function getDepartments() {
	return async (call, callback) => {
		const { page = 1, limit = 15, name } = call.request;
		const filter = { name };
		const pagination = { page, limit };
		const order = { field: 'id', direction: 'asc' };

		const {
			rows: [{ departments }],
		} = await db.query('select api.get_departments($1, $2, $3) departments', [
			JSON.stringify(filter),
			JSON.stringify(pagination),
			JSON.stringify(order),
		]);
		callback(null, { list: departments });
	};
}

function getDepartment() {
	return async (call, callback) => {
		const id = call.request.id;
		const {
			rows: [{ result }],
		} = await db.query('select api.get_department($1) result', [id]);

		callback(null, { department: result.department });
	};
}

function createDepartment() {
	return async (call, callback) => {
		await db.query('select api.insert_department($1) as result', [
			JSON.stringify(call.request),
		]);

		callback(null, {
			message: 'Department created successfully',
		});
	};
}

function updateDepartment() {
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
		await db.query('select api.update_department($1) as result', [
			JSON.stringify(call.request),
		]);
		callback(null, {
			message: 'Department updated successfully',
		});
	};
}

function deleteDepartment() {
	return async (call, callback) => {
		callback(null, { message: 'Building deleted successfully' });
	};
}

function assignMember() {
	return async (call, callback) => {
		const { department_id, member_id } = call.request;
		if (!department_id || !member_id) {
			return callback(
				{
					code: 400,
					message: 'Department ID and Member ID are required',
				},
				null,
			);
		}

		await db.query('select api.assign_member($1, $2) as result', [
			department_id,
			member_id,
		]);

		callback(null, { message: 'Member assigned successfully' });
	};
}

function unassignMember() {
	return async (call, callback) => {
		const { department_id, member_id } = call.request;
		if (!department_id || !member_id) {
			return callback(
				{
					code: 400,
					message: 'Department ID and Member ID are required',
				},
				null,
			);
		}

		await db.query('select api.unassign_member($1, $2) as result', [
			department_id,
			member_id,
		]);

		callback(null, { message: 'Member unassigned successfully' });
	};
}

function getDepartmentMembers() {
	return async (call, callback) => {
		const { department_id, page, limit, search } = call.request;
		console.log(call.request);
		if (!department_id) {
			return callback(
				{
					code: 400,
					message: 'Department ID is required',
				},
				null,
			);
		}

		const filter = { search, department_id };
		const pagination = { page, limit };
		const order = { field: 'm.id', direction: 'asc' }; // m.id is the member id

		const {
			rows: [{ members }],
		} = await db.query(
			'select api.get_department_members($1, $2, $3) members',
			[
				JSON.stringify(filter),
				JSON.stringify(pagination),
				JSON.stringify(order),
			],
		);

		callback(null, { list: members });
	};
}
module.exports = {
	getDepartments: getDepartments(),
	getDepartment: getDepartment(),
	createDepartment: createDepartment(),
	updateDepartment: updateDepartment(),
	deleteDepartment: deleteDepartment(),
	assignMember: assignMember(),
	unassignMember: unassignMember(),
	getDepartmentMembers: getDepartmentMembers(),
};
