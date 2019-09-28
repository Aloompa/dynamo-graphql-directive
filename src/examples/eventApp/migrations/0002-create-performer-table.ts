import {dynamoPromise} from '../../../util/dynamoPromise';

const createPerformersTable = dynamo => {
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
    TableName: 'performers',
  };

  return dynamoPromise(dynamo, 'listTables', {})
    .then((res: any) => {
      if (res.TableNames.includes('performers')) {
        return dynamoPromise(dynamo, 'deleteTable', {
          TableName: 'performers',
        });
      }

      return Promise.resolve();
    })
    .then(() => dynamoPromise(dynamo, 'createTable', params));
};

module.exports = createPerformersTable;
