import { InMemoryCache } from '@apollo/client';
import introspectionQueryResultData from '@web/generated/graphql.schema.json';
import typePolicies from '../typePolicies';
import memoizeOne from 'memoize-one';

const possibleTypes: Record<string, any> = {};

const processFragmentTypes = memoizeOne(() => {
	// we import this inline bc the fragmentTypes can possibly not be there on first load and this file is imported server side.
	introspectionQueryResultData.__schema.types.forEach((supertype: any) => {
		if (supertype.possibleTypes) {
			possibleTypes[supertype.name] = supertype.possibleTypes.map(
				(subtype: any) => subtype.name,
			);
		}
	});
});

const cache: () => InMemoryCache = () => {
	processFragmentTypes();
	if (!Object.keys(possibleTypes)) {
		console.log('WARNING. Possible fragment types is empty');
	}
	const theWindow = typeof window !== 'undefined' ? (window as any) : undefined;
	if (!theWindow?.__APOLLO_STATE__) {
		return new InMemoryCache({
			possibleTypes,
			typePolicies,
		});
	}
	return new InMemoryCache({
		possibleTypes,
		typePolicies,
	}).restore(
		theWindow.__APOLLO_STATE__, // eslint-disable-line
	);
};

export default cache;
