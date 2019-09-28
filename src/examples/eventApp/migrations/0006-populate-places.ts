import {dynamoPromise} from '../../../util/dynamoPromise';

const populatePlaces = dynamo => {
  const params = {
    Item: {
      id: {
        S: '1',
      },
      name: {
        S: 'The Ryman',
      },
    },
    TableName: 'places',
  };

  return dynamoPromise(dynamo, 'putItem', params);
};

module.exports = populatePlaces;
