import { gql } from 'apollo-server';
import { schemaDirective } from '@aloompa/dynamo-graphql';

export const typeDefs = gql`
  ${schemaDirective}

  interface MutationResponse {
    code: String
    message: String
  }

  type Address {
    city: String
    state: String
    zip: String
    street: [String]
  }

  type Location {
    lat: String
    long: String
    address: Address
    addresses: [Address]
  }

  type Place {
    id: String
    name: String
    location: Location
    listEvents: EventsCollection
      @dynamo(
        table: "events"
        index: "placeId-index"
        primaryKey: "placeId"
        action: "query"
      )
  }

  type Event {
    id: String
    name: String
    placeId: String
    listPerformers: PerformersCollection
      @dynamo(
        table: "performers"
        joinTable: "events-performers"
        index: "eventId-index"
        primaryKey: "eventId"
        foreignKey: "performerId"
        action: "query"
      )
    place: Place @dynamo(table: "places", action: "get", foreignKey: "placeId")
  }

  type Performer {
    id: String
    name: String
    listEvents: EventsCollection
      @dynamo(
        table: "events"
        joinTable: "events-performers"
        index: "performerId-index"
        primaryKey: "performerId"
        foreignKey: "eventId"
        action: "query"
      )
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
    searchEventsByName(query: String!): EventsCollection
      @dynamo(
        table: "events"
        action: "query"
        index: "name-index"
        primaryKey: "name"
      )
    listPerformers: PerformersCollection @dynamo(table: "performers")
    listPlaces: PlacesCollection @dynamo(table: "places")
    getPerformer(id: String!): Performer
      @dynamo(table: "performers", action: "get")
    getEvent(id: String!): Event @dynamo(table: "events", action: "get")
    getPlace(id: String!): Place @dynamo(table: "places", action: "get")
  }

  input AddressInput {
    city: String
    state: String
    zip: String
    street: [String]
  }

  input LocationInput {
    lat: String
    long: String
    address: AddressInput
    addresses: [AddressInput]
  }

  input EventInput {
    name: String
    placeId: String
  }

  input PlaceInput {
    name: String
    location: LocationInput
  }

  type Mutation {
    createEvent(input: EventInput): EventMutationResponse
      @dynamo(table: "events", action: "create")
    updateEvent(id: String!, input: EventInput): EventMutationResponse
      @dynamo(table: "events", action: "update")
    destroyEvent(id: String!): EventMutationResponse
      @dynamo(table: "events", action: "destroy")
    createPlace(input: PlaceInput): PlaceMutationResponse
      @dynamo(table: "places", action: "create")
    updatePlace(id: String!, input: PlaceInput): PlaceMutationResponse
      @dynamo(table: "places", action: "update")
    destroyPlace(id: String!): PlaceMutationResponse
      @dynamo(table: "places", action: "destroy")
  }
`;
