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

  type Query {
    getEvent(id: String!): Event @dynamo(table: "events", action: "get")
  }

  input EventInput {
    name: String
  }

  type Mutation {
    createEvent(input: EventInput): EventMutationResponse
      @dynamo(table: "events", action: "create")
    updateEvent(id: String!, input: EventInput): EventMutationResponse
      @dynamo(table: "events", action: "update")
    destroyEvent(id: String!): EventMutationResponse
      @dynamo(table: "events", action: "destroy")
  }
`;

describe('CRUD Operations', () => {
  it('Should create, update and delete a record', async () => {
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

    const createEventResponse = (await mutate({
      mutation: `mutation CreateEvent ($name: String) {
        createEvent(input: { name: $name }) {
          code
          item{
            id
            name
          }
          message
        }
      }`,
      variables: { name: 'TEST EVENT' }
    })) as any;

    expect(createEventResponse.data.createEvent.item.name).toEqual(
      'TEST EVENT'
    );

    const updateEventResponse = (await mutate({
      mutation: `mutation UpdateEvent ($id: String! $name: String) {
          updateEvent(id: $id input: { name: $name  }) {
            code
            item{
              id
              name
            }
            message
          }
        }`,
      variables: {
        id: createEventResponse.data.createEvent.item.id,
        name: 'TEST EVENT UPDATE'
      }
    })) as any;

    expect(updateEventResponse.data.updateEvent.item.name).toEqual(
      'TEST EVENT UPDATE'
    );

    const getEventResponse = (await query({
      query: `query GetEvent ($id: String!) {
            getEvent(id: $id) {
                id
                name
            }
        }`,
      variables: {
        id: updateEventResponse.data.updateEvent.item.id
      }
    })) as any;

    expect(getEventResponse.data.getEvent.name).toEqual('TEST EVENT UPDATE');

    const destroyEventResponse = (await mutate({
      mutation: `mutation DestroyEvent ($id: String!) {
        destroyEvent(id: $id) {
            code
            item{
                id
            }
            message
        }
        }`,
      variables: {
        id: updateEventResponse.data.updateEvent.item.id
      }
    })) as any;

    expect(destroyEventResponse.data.destroyEvent.item.id).toEqual(
      updateEventResponse.data.updateEvent.item.id
    );

    return server.stop();
  });
});
