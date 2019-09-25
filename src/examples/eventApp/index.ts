import {ApolloServer} from 'apollo-server';
import {createDynamoSchema} from '../../index';
import {typeDefs} from './schema';

const server = new ApolloServer({
  typeDefs,
  resolvers: {},
  schemaDirectives: {
    dynamo: createDynamoSchema({
      endpoint: 'http://localhost:8000',
    }),
  },
});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
