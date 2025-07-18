'use client';
// ^ this file needs the "use client" pragma
import { ApolloLink } from '@apollo/client';

import {
	InMemoryCache,
	ApolloClient,
	SSRMultipartLink,
	ApolloNextAppProvider,
} from '@apollo/experimental-nextjs-app-support';
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
			typePolicies: typePolicies as any,
		});
	}
	return new InMemoryCache({
		possibleTypes,
		typePolicies: typePolicies as any,
	}).restore(
		theWindow.__APOLLO_STATE__, // eslint-disable-line
	);
};
// have a function to create a client for you
function makeClient() {
	const localCache = cache();
	const httpLink = getHTTPLink(
		typeof window === 'undefined',
		{
			fetchOptions: { cache: 'no-store' },
		},
		true,
	);

	return new ApolloClient({
		// use the `NextSSRInMemoryCache`, not the normal `InMemoryCache`
		cache: localCache,
		link: (typeof window === 'undefined'
			? ApolloLink.from([
					// in a SSR environment, if you use multipart features like
					// @defer, you need to decide how to handle these.
					// This strips all interfaces with a `@defer` directive from your queries.
					new SSRMultipartLink({
						stripDefer: true,
					}) as any,
					httpLink,
			  ])
			: httpLink) as any,
	});
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
	return (
		<ApolloNextAppProvider makeClient={makeClient}>
			{children}
		</ApolloNextAppProvider>
	);
}
