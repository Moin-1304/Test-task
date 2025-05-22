import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

// HTTP link
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Auth link for adding the token to requests
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Cache configuration with type policies for pagination
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getEmployees: {
          // Configure pagination for employees query
          keyArgs: ["filter", "sortBy", "sortOrder"],
          merge(existing = { employees: [], totalCount: 0 }, incoming) {
            return {
              employees: [...existing.employees, ...incoming.employees],
              totalCount: incoming.totalCount,
            };
          },
        },
      },
    },
  },
});

// Create the Apollo Client
export const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});