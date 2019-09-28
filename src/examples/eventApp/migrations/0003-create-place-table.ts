import {dynamoPromise} from '../../../util/dynamoPromise';

const createPlaceTable = dynamo => {
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
    TableName: 'places',
  };

  return dynamoPromise(dynamo, 'listTables', {})
    .then((res: any) => {
      if (res.TableNames.includes('places')) {
        return dynamoPromise(dynamo, 'deleteTable', {
          TableName: 'places',
        });
      }

      return Promise.resolve();
    })
    .then(() => dynamoPromise(dynamo, 'createTable', params));
};

module.exports = createPlaceTable;
