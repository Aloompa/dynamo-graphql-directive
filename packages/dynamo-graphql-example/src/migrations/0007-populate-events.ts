import { dynamoPromise } from '@aloompa/dynamo-graphql';

const populateEvents = (dynamo) => {
  return Promise.all([
    dynamoPromise(dynamo, 'putItem', {
      Item: {
        id: {
          S: 'fbb4d476-80a4-4440-9968-1988e9f169ef'
        },
        placeId: {
          S: '3c1e8751-a6d3-4bce-ba52-d020ed09a3a4'
        },
        name: {
          S: 'Arcade Fire at the Ryman'
        }
      },
      TableName: 'events'
    }),
    dynamoPromise(dynamo, 'putItem', {
      Item: {
        id: {
          S: 'b4f7592d-82b9-4adf-a838-7747f7f52ca9'
        },
        placeId: {
          S: 'd8577d3f-ecc4-4237-889c-f358466d8fbb'
        },
        name: {
          S: 'The Decemberists at Canary Ballroom'
        }
      },
      TableName: 'events'
    })
  ]);
};

module.exports = populateEvents;
