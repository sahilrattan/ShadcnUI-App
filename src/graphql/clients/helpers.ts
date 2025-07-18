import introspectionQueryResultData from '@web/generated/graphql.schema.json';
import memoizeOne from 'memoize-one';

export const getPossibleTypes = memoizeOne(() => {
	const possibleTypes: Record<string, any> = {};
	// we import this inline bc the fragmentTypes can possibly not be there on first load and this file is imported server side.
	introspectionQueryResultData.__schema.types.forEach((supertype: any) => {
		if (supertype.possibleTypes) {
			possibleTypes[supertype.name] = supertype.possibleTypes.map(
				(subtype: any) => subtype.name,
			);
		}
	});
	return possibleTypes;
});
