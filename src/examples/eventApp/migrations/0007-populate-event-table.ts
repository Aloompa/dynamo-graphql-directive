import {dynamoPromise} from '../../../util/dynamoPromise';

const populateEvents = dynamo => {
  const params = {
    Item: {
      id: {
        S: '1',
      },
      placeId: {
        S: '1',
      },
      eventIds: {
        L: [{S: '1'}],
      },
      name: {
        S: 'Arcade Fire at the Ryman',
      },
    },
    TableName: 'events',
  };

  return dynamoPromise(dynamo, 'putItem', params);
};

module.exports = populateEvents;
