import path from 'node:path';
import { buildSchema } from 'type-graphql';
// import { autoRelay } from "../gql-types/auto-relay";
import { resolvers } from './resolvers';

// console.log(autoRelay);
export const schema = await buildSchema({
	// Array of resolvers
	resolvers,
	// Create 'schema.graphql' file with schema definition in current directory
	emitSchemaFile: path.resolve('src/generated/schema.graphql'),
});
