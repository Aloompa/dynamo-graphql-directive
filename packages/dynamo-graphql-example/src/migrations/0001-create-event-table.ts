import { dynamoPromise } from '@aloompa/dynamo-graphql';

const createEventTable = (dynamo) => {
  const params = {
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S'
      },
      {
        AttributeName: 'placeId',
        AttributeType: 'S'
      },
      {
        AttributeName: 'name',
        AttributeType: 'S'
      }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'placeId-index',
        KeySchema: [
          {
            AttributeName: 'placeId',
            KeyType: 'HASH'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      },
      {
        IndexName: 'name-index',
        KeySchema: [
          {
            AttributeName: 'name',
            KeyType: 'HASH'
          }
        ],
        Projection: {
          ProjectionType: 'ALL'
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      }
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH'
      }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    TableName: 'events'
  };
  return dynamoPromise(dynamo, 'listTables', {})
    .then((res: any) => {
      if (res.TableNames.includes('events')) {
        return dynamoPromise(dynamo, 'deleteTable', {
          TableName: 'events'
        });
      }

      return Promise.resolve();
    })
    .then(() => dynamoPromise(dynamo, 'createTable', params));
};

module.exports = createEventTable;
