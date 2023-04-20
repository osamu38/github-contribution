import { GraphQLClient } from 'graphql-request';
import { getSdk } from '@/graphql/types';

export const graphQLClient = new GraphQLClient(
  'https://api.github.com/graphql',
);

export const client = getSdk(graphQLClient);
