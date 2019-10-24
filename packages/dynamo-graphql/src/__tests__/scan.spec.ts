import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server';
import { createDynamoSchema, schemaDirective } from '../index';

const typeDefs = gql`
  ${schemaDirective}

  type Event {
    id: String
    name: String
  }

  interface MutationResponse {
    code: String
    message: String
  }

  type EventMutationResponse implements MutationResponse {
    code: String
    message: String
    item: Event
  }

  type EventsCollection {
    items: [Event]
  }

  type Query {
    listEvents: EventsCollection @dynamo(table: "events")
  }

  input EventInput {
    name: String
  }

  type Mutation {
    createEvent(input: EventInput): EventMutationResponse
      @dynamo(table: "events", action: "create")
    destroyEvent(id: String!): EventMutationResponse
      @dynamo(table: "events", action: "destroy")
  }
`;

describe('Scan', () => {
  it('Should scan the events', async () => {
    const server = new ApolloServer({
      typeDefs,
      resolvers: {},
      schemaDirectives: {
        dynamo: createDynamoSchema(
          {
            endpoint: 'http://localhost:8000'
          },
          {
            getTableName: (name) => `${name}`
          }
        )
      }
    });

    await server.listen(4001);

    const { mutate, query } = createTestClient(server);

    const createEventResponse1 = (await mutate({
      mutation: `mutation CreateEvent ($name: String) {
        createEvent(input: { name: $name }) {
          item{
            id
          }
        }
      }`,
      variables: { name: 'TEST EVENT' }
    })) as any;

    const createEventResponse2 = (await mutate({
      mutation: `mutation CreateEvent ($name: String) {
          createEvent(input: { name: $name }) {
            item{
              id
            }
          }
        }`,
      variables: { name: 'TEST EVENT2' }
    })) as any;

    const scanResponse = (await query({
      query: `{
          listEvents {
            items {
              id
            }
          }
        }`,
      variables: {}
    })) as any;

    expect(scanResponse.data.listEvents.items.length).toBeTruthy();

    await mutate({
      mutation: `mutation DestroyEvent ($id: String!) {
        destroyEvent(id: $id) {
            code
        }
        }`,
      variables: {
        id: createEventResponse1.data.createEvent.item.id
      }
    });

    await mutate({
      mutation: `mutation DestroyEvent ($id: String!) {
          destroyEvent(id: $id) {
              code
          }
          }`,
      variables: {
        id: createEventResponse2.data.createEvent.item.id
      }
    });

    return server.stop();
  });
});
