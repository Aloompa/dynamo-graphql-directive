import {dynamoPromise} from '../../../util/dynamoPromise';

const createEventTable = dynamo => {
  const params = {
    AttributeDefinitions: [
      {
        AttributeName: 'id',
        AttributeType: 'S',
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
    TableName: 'events',
  };
  return dynamoPromise(dynamo, 'listTables', {})
    .then((res: any) => {
      if (res.TableNames.includes('events')) {
        return dynamoPromise(dynamo, 'deleteTable', {
          TableName: 'events',
        });
      }

      return Promise.resolve();
    })
    .then(() => dynamoPromise(dynamo, 'createTable', params));
};

module.exports = createEventTable;
