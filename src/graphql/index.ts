import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { schema } from '@web/graphql/schema';
import { Context } from './types';
import { serverConfig } from '@web/config/server';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { GraphQLFormattedError } from 'graphql/error';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { ApolloServerPluginInlineTraceDisabled } from '@apollo/server/plugin/disabled';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';

const debugGraphQL: any = console.log;
const debugGraphQLTrace: any = console.log;
debugGraphQL.enabled = process.env.NODE_ENV === 'development';
debugGraphQLTrace.enabled = process.env.NODE_ENV === 'development';
const {
	redis: { host, port, pw, disable: disableRedis },
} = serverConfig;

const options: Record<string, any> = pw
	? {
			password: pw.length ? pw : undefined,
			tls:
				process.env.NODE_ENV !== 'development'
					? {
							rejectUnauthorized: false,
					  }
					: undefined,
	  }
	: {};

const cache = disableRedis
	? new InMemoryLRUCache({
			// ~100MiB
			maxSize: Math.pow(2, 20) * 100,
			// 5 minutes (in milliseconds)
			ttl: 300_000,
	  })
	: new KeyvAdapter(
			new Keyv({
				store: new KeyvRedis(
					`redis://:${pw || ''}@${host}:${port}`,
					options,
				) as any,
			}),
	  );

const server = new ApolloServer({
	schema,
	introspection: true,
	allowBatchedHttpRequests: true,
	includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
	cache,
	persistedQueries: {
		cache,
	},
	formatError: (gqlError: GraphQLFormattedError, actualError: any) => {
		const err = { ...gqlError };
		const queryNotFound = err.message === 'PersistedQueryNotFound';
		const sourceErr = actualError;
		if (!queryNotFound) {
			debugGraphQL('Apollo errors================');
			debugGraphQL(err?.message);
			debugGraphQL(sourceErr?.source?.body);
		}
		if (err.extensions?.statusCode !== 422 && !queryNotFound) {
			debugGraphQL('Graphql Error');
			debugGraphQL(err?.message);
			debugGraphQL(err.extensions?.statusCode);
			// debugGraphQL(err?.extensions?.exception?.codeFrame);
			// @ts-ignore - this is a hack to get the stacktrace
			debugGraphQL(err?.extensions?.exception?.stacktrace);
		}
		return err;
	},
	plugins: [
		debugGraphQLTrace.enabled && process.env.NODE_ENV !== 'test'
			? ApolloServerPluginInlineTrace()
			: ApolloServerPluginInlineTraceDisabled(),
		ApolloServerPluginCacheControl({ defaultMaxAge: 60 }),
	],
});

export default startServerAndCreateNextHandler(server, {
	context: async (req, res) => {
		return {
			// ...initContextCache(),
			user: (req as any).user,
			// get getLoader() {
			//   return <K, V>(ref: LoadableRef<K, V, Context>) =>
			//     ref.getDataloader(this);
			// },
			// get load() {
			//   return <K, V>(ref: LoadableRef<K, V, Context>, id: K) =>
			//     ref.getDataloader(this).load(id);
			// },
			// get loadMany() {
			//   return <K, V>(ref: LoadableRef<K, V, Context>, ids: K[]) =>
			//     rejectErrors(ref.getDataloader(this).loadMany(ids));
			// },
		};
	},
});
