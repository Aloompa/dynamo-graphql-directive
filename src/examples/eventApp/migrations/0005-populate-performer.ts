import {dynamoPromise} from '../../../util/dynamoPromise';

const populatePerformer = dynamo => {
  const params = {
    Item: {
      id: {
        S: 'e8001849-86a3-4453-81a8-fe59dadfc5d7',
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
