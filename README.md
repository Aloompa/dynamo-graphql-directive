# Dynamo GraphQL Directive

This project is designed to expose Dynamo to the GraphQL as an ORM as detailed on [GraphQL Schema Directives as ORM](https://medium.com/brikl-engineering/graphql-schema-directives-as-orm-ec635fdc942d) by Tobias Meixner.

The idea is eventually be able to drive the entire backend through the schema without a need for handwriting any resolvers or mutations.

For an example of this in action, see the [Event App](https://github.com/Aloompa/dynamo-graphql-directive/tree/master/src/examples/eventApp/schema.ts).

## Why this Library?

At Aloompa, we use DynamoDB for a lot of stuff. Due to the complexity of our authentication layer, we aren't able to migrate to AWS AppSync because they don't allow custom directives, but we also have felt the pain of writing an excess of boilerplate along with the Vogels and Dynogles libraries on top of DynamoDB going unmaintained. We started this library as an experiment to see how far we could get using GraphQL as our ORM on top of raw queries using the AWS SDK.

## Opinionated

There will be some opinions built into this directive, such as the shape of lists and mutation responses. I will endeavor to follow the best practices laid out by Facebook, Apollo and the AWS Amplify team, but if you don't like falling into the pit of success, this library might not be your thing.

## Not Suitable for Production (Yet)

This is obviously a very new project and is not suitable for production applications yet, so use it with caution and _please_ contribute to the project if you think it could be useful.

## Installation

With NPM:

`npm i @aloompa/dynamo-graphql-directive -S`

With Yarn:

`yarn add @aloompa/dynamo-graphql-directive --save`

## Getting Started

```js
import { ApolloServer } from 'apollo-server';
import { createDynamoSchema } from '@aloompa/dynamo-graphql-directive';
import { typeDefs } from './schema';

const server = new ApolloServer({
  typeDefs,
  resolvers: {},
  schemaDirectives: {
    dynamo: createDynamoSchema({
      // Your custom AWS Dynamo config goes here
      endpoint: 'http://localhost:8000'
    })
  }
});

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

For a full list of what can be passed in to the `createDynamoSchema` function, check out the [AWS docs](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html)

Additionally, there are options, you may pass in as a second argument to `createDynamoSchema`:

### getTableName: Function(String) => String

If you prefix or postfix all of your table names with the development environment, this can be handy to override the table names. Everytime we get the name of a table, we pass it into this function so that you can return a new formatted name.

```js
createDynamoSchema({ ... }, { getTableName: name => `${name}-dev` })
```

## Running the examples

To run the examples, you need to install dynamo local. The instructions for that can be found in the [AWS docs](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html).

After it is set up, you just need to run `java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb` to run the database and then navigate to the `./packages/dynamo-graphql-example` directory and run:

`yarn migrations; yarn start`

## Example Usage

### Scan an entire table

```gql
type Event {
  id: String
  name: String
}

type EventsCollection {
  items: [Event]
}

type Query {
  listEvents: EventsCollection @dynamo(table: "events")
}
```

### Get an item

```gql
type Event {
  id: String
  name: String
}

type Query {
  getEvent(id: String!): Event @dynamo(table: "events", action: "get")
}
```

### Query a table

**Coming Soon**, but I think it will look like:

```gql
type Event {
  id: String
  name: String
}

type EventsCollection {
  items: [Event]
}

type Query {
  listEventsByName(query: String!): EventsCollection
    @dynamo(table: "events", action: "query", index: "name-index")
}
```

### One to one relationships

```gql
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

type Query {
  getEvent(id: String!): Event @dynamo(table: "events", action: "get")
}
```

### One to many relationships with a join table

```gql
type Event {
  id: String
  placeId: String
}

type Place {
  id: String
  listEvents: EventsCollection
    @dynamo(
      table: "events"
      index: "placeId-index"
      primaryKey: "placeId"
      action: "query"
    )
}

type Query {
  listEvents: EventsCollection @dynamo(table: "events")
  listPlaces: PlacesCollection @dynamo(table: "places")
}
```

### Many to many relationships with a join table

```gql
type EventsCollection {
  items: [Event]
}

type PerformersCollection {
  items: [Performer]
}

type Performer {
  id: String
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

type Event {
  id: String
  listPerformers: PerformersCollection
    @dynamo(
      table: "performers"
      joinTable: "events-performers"
      index: "eventId-index"
      primaryKey: "eventId"
      foreignKey: "performerId"
      action: "query"
    )
}

type Query {
  listEvents: EventsCollection @dynamo(table: "events")
  listPerformers: PerformersCollection @dynamo(table: "performers")
}
```

### Create Item Mutations

```gql
type Event {
  id: String
  name: String
}

type EventMutationResponse {
  code: String
  message: String
  item: Event
}

input EventInput {
  name: String
}

type Mutation {
  createEvent(input: EventInput): EventMutationResponse
    @dynamo(table: "events", action: "create")
}
```

### Update Item Mutations

```gql
type Event {
  id: String
  name: String
}

type EventMutationResponse {
  code: String
  message: String
  item: Event
}

input EventInput {
  name: String
}

type Mutation {
  updateEvent(id: String!, input: EventInput): EventMutationResponse
    @dynamo(table: "events", action: "update")
}
```

### Destroy Item Mutation

```gql
type Event {
  id: String
  name: String
}

type EventMutationResponse {
  code: String
  message: String
  item: Event
}

type Mutation {
  destroyEvent(id: String!): EventMutationResponse
    @dynamo(table: "events", action: "destroy")
}
```

## Contributing

We encourage you to contribute to Dynamo GraphQL Directive by submitting bug reports and pull requests through [Github](http//github.com).

## License

Dynamo GraphQL Directive is released under The [MIT License](http://www.opensource.org/licenses/MIT) (MIT)

Copyright (c) [2019][aloompa llc]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
