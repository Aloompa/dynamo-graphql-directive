import {dynamoPromise} from '../../../util/dynamoPromise';

const populatePerformer = dynamo => {
  const params = {
    Item: {
      id: {
        S: '1',
      },
      name: {
        S: 'Arcade Fire',
      },
    },
    TableName: 'performers',
  };

  return dynamoPromise(dynamo, 'putItem', params);
};

module.exports = populatePerformer;
