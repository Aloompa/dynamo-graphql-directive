import {gql} from 'apollo-server';
import {schemaDirective} from '../../index';

export const typeDefs = gql`
  ${schemaDirective}

  interface MutationResponse {
    code: String
    message: String
  }

  type Place {
    id: String
    name: String
  }

  type Event {
    id: String
    name: String
    placeId: String
    listPerformers: [Performer]
      @dynamo(table: "performers", index: "eventId-index")
    place: Place @dynamo(table: "places", action: "get", foreignKey: "placeId")
  }

  type Performer {
    id: String
    name: String
    listEvents: [Event] @dynamo(table: "events", index: "performerId-index")
  }

  type EventsCollection {
    items: [Event]
  }

  type PerformersCollection {
    items: [Performer]
  }

  type PlacesCollection {
    items: [Place]
  }

  type EventMutationResponse implements MutationResponse {
    code: String
    message: String
    item: Event
  }

  type PlaceMutationResponse implements MutationResponse {
    code: String
    message: String
    item: Event
  }

  type Query {
    listEvents: EventsCollection @dynamo(table: "events")
    listPerformers: PerformersCollection @dynamo(table: "performers")
    listPlaces: PlacesCollection @dynamo(table: "places")
    getPerformer(id: String!): Performer
      @dynamo(table: "performers", action: "get")
    getEvent(id: String!): Event @dynamo(table: "events", action: "get")
    getPlace(id: String!): Place @dynamo(table: "places", action: "get")
  }

  type Mutation {
    createEvent(name: String, placeId: String): EventMutationResponse
      @dynamo(table: "events", action: "create")
    updateEvent(
      id: String!
      name: String
      placeId: String
    ): EventMutationResponse @dynamo(table: "events", action: "update")
    destroyEvent(id: String!): EventMutationResponse
      @dynamo(table: "events", action: "destroy")
    createPlace(name: String): PlaceMutationResponse
      @dynamo(table: "places", action: "create")
    updatePlace(id: String!, name: String): PlaceMutationResponse
      @dynamo(table: "places", action: "update")
    destroyPlace(id: String!): PlaceMutationResponse
      @dynamo(table: "places", action: "destroy")
  }
`;
