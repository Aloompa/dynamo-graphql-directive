import {dynamoPromise} from '../../../util/dynamoPromise';

const populateEventsPerformers = dynamo => {
  const params = {
    Item: {
      id: {
        S: '1',
      },
      performerId: {
        S: '1',
      },
      eventId: {
        S: '1',
      },
    },
    TableName: 'events-performers',
  };

  return dynamoPromise(dynamo, 'putItem', params);
};

module.exports = populateEventsPerformers;
