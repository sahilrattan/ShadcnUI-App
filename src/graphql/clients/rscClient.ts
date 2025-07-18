import { ApolloClient, InMemoryCache } from '@apollo/client';
import { cookies } from 'next/headers';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support';
import { getPossibleTypes } from './helpers';
import typePolicies from '../typePolicies';
import { getHTTPLink } from './httpLink';

const cache: () => InMemoryCache = () => {
	const possibleTypes = getPossibleTypes();
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

export const { getClient } = registerApolloClient(() => {
	const localCache = cache();
	const httpLink = getHTTPLink(
		typeof window === 'undefined',
		{
			headers: { Cookie: cookies().toString() },
		},
		true,
	);
	return new ApolloClient({
		cache: localCache,
		link: httpLink,
	}) as any;
});
