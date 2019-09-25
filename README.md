# @aloompa/dynamo-graphql-directive

This project is designed to expose Dynamo to the GraphQL as an ORM as detailed on [GraphQL Schema Directives as ORM](https://medium.com/brikl-engineering/graphql-schema-directives-as-orm-ec635fdc942d) by Tobias Meixner.

The idea is eventually be able to drive the entire backend through the schema without a need for handwriting any resolvers or mutations.

### Installation

With NPM:

`npm i @aloompa/dynamo-graphql-directive -S`

With Yarn:

`yarn add @aloompa/dynamo-graphql-directive --save`

### Getting Started

```js
import {ApolloServer} from 'apollo-server';
import {createDynamoSchema} from '@aloompa/dynamo-graphql-directive';
import {typeDefs} from './schema';

const server = new ApolloServer({
  typeDefs,
  resolvers: {},
  schemaDirectives: {
    dynamo: createDynamoSchema({
      // Your custom AWS Dynamo config goes here
      endpoint: 'http://localhost:8000',
    }),
  },
});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url}`);
});
```

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
  listEventsByApp(query: String!): EventsCollection
    @dynamo(table: "events", action: "query", index: "appId-index")
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

### One to many relationships

Coming Soon

### Many to many relationships

Coming Soon

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

type Mutation {
  createEvent(name: String): EventMutationResponse
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

type Mutation {
  updateEvent(id: String!, name: String): EventMutationResponse
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

We encourage you to contribute to React Universal Router by submitting bug reports and pull requests through [Github](http//github.com).

## License

React Universal Router is released under The [MIT License](http://www.opensource.org/licenses/MIT) (MIT)

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
