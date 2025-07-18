import { GraphQLSchema } from 'graphql/type';

import {
	upperCaseDirectiveConfig,
	upperCaseDirectiveTransformer,
} from './upperCase';

const directivesConfigs = {
	...upperCaseDirectiveConfig,
};

const directivesTransformers = (schema: GraphQLSchema) => {
	schema = upperCaseDirectiveTransformer(schema);
	return schema;
};

export { directivesConfigs, directivesTransformers };
