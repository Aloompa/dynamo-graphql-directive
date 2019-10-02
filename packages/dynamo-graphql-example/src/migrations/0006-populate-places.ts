import { dynamoPromise } from '@aloompa/dynamo-graphql';

const populatePlaces = (dynamo) => {
  return Promise.all([
    dynamoPromise(dynamo, 'putItem', {
      Item: {
        id: {
          S: '3c1e8751-a6d3-4bce-ba52-d020ed09a3a4'
        },
        name: {
          S: 'The Ryman'
        }
      },
      TableName: 'places'
    }),
    dynamoPromise(dynamo, 'putItem', {
      Item: {
        id: {
          S: 'd8577d3f-ecc4-4237-889c-f358466d8fbb'
        },
        name: {
          S: 'Canary Ballroom'
        }
      },
      TableName: 'places'
    })
  ]);
};

module.exports = populatePlaces;
