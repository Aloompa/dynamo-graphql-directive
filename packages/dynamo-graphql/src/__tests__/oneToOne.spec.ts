import { createTestClient } from 'apollo-server-testing';
import { ApolloServer, gql } from 'apollo-server';
import { createDynamoSchema, schemaDirective } from '../index';

const typeDefs = gql`
  ${schemaDirective}

  type Place {
    id: String
    name: String
  }

  type Event {
    id: String
    name: String
    placeId: String
    place: Place @dynamo(table: "places", action: "get", foreignKey: "placeId")
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

  type PlaceMutationResponse implements MutationResponse {
    code: String
    message: String
    item: Place
  }

  type EventsCollection {
    items: [Event]
  }

  type Query {
    getEvent(id: String!): Event @dynamo(table: "events", action: "get")
  }

  input EventInput {
    name: String
    placeId: String
  }

  input PlaceInput {
    name: String
  }

  type Mutation {
    createEvent(input: EventInput): EventMutationResponse
      @dynamo(table: "events", action: "create")
    destroyEvent(id: String!): EventMutationResponse
      @dynamo(table: "events", action: "destroy")
    createPlace(input: PlaceInput): PlaceMutationResponse
      @dynamo(table: "places", action: "create")
    destroyPlace(id: String!): PlaceMutationResponse
      @dynamo(table: "places", action: "destroy")
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

    const createPlaceResponse = (await mutate({
      mutation: `mutation CreatePlace ($name: String) {
            createPlace(input: { name: $name }) {
              item{
                id
                name
              }
            }
          }`,
      variables: { name: 'TEST PLACE' }
    })) as any;

    const placeId = createPlaceResponse.data.createPlace.item.id;

    const createEventResponse = (await mutate({
      mutation: `mutation CreateEvent ($name: String $placeId: String) {
        createEvent(input: { name: $name placeId: $placeId }) {
          item{
            id
            name
            placeId
          }
        }
      }`,
      variables: { name: 'TEST EVENT', placeId }
    })) as any;

    const eventId = createEventResponse.data.createEvent.item.id;

    const getEventPlace = (await query({
      query: `query GetEvent ($id: String!) {
          getEvent(id: $id) {
            id
            name
            placeId
            place {
                id
                name
            }
          }
        }`,
      variables: {
        id: eventId
      }
    })) as any;

    expect(getEventPlace.data.getEvent.place.id).toEqual(placeId);
    expect(getEventPlace.data.getEvent.place.name).toEqual('TEST PLACE');

    await mutate({
      mutation: `mutation DestroyEvent ($id: String!) {
        destroyEvent(id: $id) {
            code
        }
    }`,
      variables: {
        id: eventId
      }
    });

    await mutate({
      mutation: `mutation DestroyPlace ($id: String!) {
          destroyPlace(id: $id) {
              code
          }
        }`,
      variables: {
        id: placeId
      }
    });

    return server.stop();
  });
});
