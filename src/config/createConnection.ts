import * as AWS from 'aws-sdk';

export const createConnection = options => {
  const dynamo = new AWS.DynamoDB(options);

  return dynamo;
};
