const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const {
	buildingHandler,
	departmentHandler,
	staffMembersHandler,
	propertyHandler,
	assignmentsHandler,
} = require('./grpc-handlers');
require('./db');

const options = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
};

const packageDefinition = protoLoader.loadSync(
	path.resolve(__dirname, '../proto/main.proto'),
	options,
);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
server.addService(
	protoDescriptor.BuildingManagementService.service,
	buildingHandler,
);
server.addService(
	protoDescriptor.DepartmentManagementService.service,
	departmentHandler,
);
server.addService(
	protoDescriptor.StaffManagementService.service,
	staffMembersHandler,
);
server.addService(
	protoDescriptor.PropertyManagementService.service,
	propertyHandler,
);

server.addService(
	protoDescriptor.PropertyAssignmentService.service,
	assignmentsHandler,
);

server.bind(
	`${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`,
	grpc.ServerCredentials.createInsecure(),
);
server.start();
console.log(
	`gRPC server running at ${process.env.GRPC_HOST}:${process.env.GRPC_PORT}`,
);
