import { dynamoPromise } from "../../../dynamo-graphql/src/util/dynamoPromise";

const populateEventsPerformers = dynamo => {
  const params = {
    Item: {
      id: {
        S: "98a7aa20-7049-4a57-be12-36bcd9f19485"
      },
      performerId: {
        S: "e8001849-86a3-4453-81a8-fe59dadfc5d7"
      },
      eventId: {
        S: "fbb4d476-80a4-4440-9968-1988e9f169ef"
      }
    },
    TableName: "events-performers"
  };

  return dynamoPromise(dynamo, "putItem", params);
};

module.exports = populateEventsPerformers;
