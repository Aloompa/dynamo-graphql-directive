import {dynamoPromise} from '../../../util/dynamoPromise';

const createEventPerformerTable = dynamo => {
  const params = {
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
      },
      {
        AttributeName: 'performerId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'eventId',
        AttributeType: 'S',
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'performerId-index',
        KeySchema: [
          {
            AttributeName: 'performerId',
            KeyType: 'HASH',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
      {
        IndexName: 'eventId-index',
        KeySchema: [
          {
            AttributeName: 'eventId',
            KeyType: 'HASH',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
    KeySchema: [
      {
        AttributeName: 'id',
        KeyType: 'HASH',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    TableName: 'events-performers',
  };
  return dynamoPromise(dynamo, 'listTables', {})
    .then((res: any) => {
      if (res.TableNames.includes('events-performers')) {
        return dynamoPromise(dynamo, 'deleteTable', {
          TableName: 'events-performers',
        });
      }

      return Promise.resolve();
    })
    .then(() => dynamoPromise(dynamo, 'createTable', params));
};

module.exports = createEventPerformerTable;
