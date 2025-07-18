import { clientConfig } from "@web/config/client";
import { BatchHttpLink } from "@apollo/client/link/batch-http";
import { createHttpLink, from, split } from "@apollo/client";
import { HttpOptions } from "@apollo/client/link/http/selectHttpOptionsAndBody";
import { setContext } from "@apollo/client/link/context";
import { createPersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { hashAsync } from "@web/utils/hashHelper";

import { onError } from "@apollo/client/link/error";

// Log any GraphQL errors or network error that occurred
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) => {
      if (message !== "PersistedQueryNotFound") {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        );
      }
    });
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const illegalHeaders: string[] = [
  "connection",
  // 'cookie',
  // 'host',
  // 'referer',
  // 'accept-encoding',
];

const {
  graphql: { uri },
} = clientConfig;
const stripIllegalHeaders = (
  isServer: boolean,
  headers: { [key: string]: string }
) => {
  if (isServer) {
    const headerCopy = { ...headers };
    headerCopy["x-forwarded-host"] = headerCopy.host;
    for (let x = 0; x < Object.keys(illegalHeaders).length; x++) {
      const hdr = illegalHeaders[x] as keyof typeof headers;
      delete headerCopy[hdr];
    }
    return headerCopy;
  }
  return headers;
};

const stripIllegalHeadersLinkFromContext = (isServer: boolean) =>
  setContext((_request, previousContext) => {
    let incomingHeaders = { ...(previousContext.headers || {}) };
    // Moved from `httpLink` to here
    if (isServer) {
      incomingHeaders = stripIllegalHeaders(isServer, incomingHeaders);
    }
    return {
      ...previousContext,
      headers: incomingHeaders,
    };
  });

const createBatchHttpLink = (() => {
  let _batchHttpLink: BatchHttpLink;
  return (options: BatchHttpLink.Options) => {
    if (!_batchHttpLink) {
      _batchHttpLink = new BatchHttpLink(options);
    }
    return _batchHttpLink;
  };
})();

const getHTTPLink = (
  isServer: boolean,
  opts: HttpOptions | BatchHttpLink.Options = {},
  usePresistedQueries?: boolean
) => {
  const options: HttpOptions | HttpOptions | BatchHttpLink.Options = {
    fetch: isServer ? opts.fetch : undefined,
    uri,
    fetchOptions: {
      ...opts.fetchOptions,
      // permits cross origin from http => https
      // mode: 'no-cors',
      // 'same-origin' for the client can be used if server on a different domain
      credentials: isServer ? "same-origin" : "include",
      timeout: 30000,
    },
    credentials: isServer ? "same-origin" : "include",
  };
  // Workaround in order to pass cookies

  if (isServer) {
    // Workaround in order to pass cookies
    let incomingHeaders = { ...(opts?.headers || {}) };
    // node 18 fetch replacement undici doesn't accept certain headers such as 'connection'
    // https://github.com/nodejs/undici/blob/9e5316c8b04a7b35522d0d5b8de71f67fa2a3c34/lib/fetch/constants.js#L3
    incomingHeaders = stripIllegalHeaders(isServer, incomingHeaders);
    options.headers = incomingHeaders;
  }
  // switch between normal operation and batch operation

  const links = from([
    errorLink,
    stripIllegalHeadersLinkFromContext(isServer),
    split(
      (operation) => isServer,
      createHttpLink(options),
      createBatchHttpLink(options)
    ),
  ]);
  if (usePresistedQueries) {
    const presistLink = createPersistedQueryLink({
      generateHash: hashAsync,
      // batch link not support get
      // useGETForHashedQueries: true,
    });
    return presistLink.concat(links);
  }
  return links;
};

export { getHTTPLink };
