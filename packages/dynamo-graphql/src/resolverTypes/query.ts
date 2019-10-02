import { dynamoPromise, getTableName, normalizeResponseArray } from '../util';
import { get } from './get';

const queryJoinTable = ({ dynamodb, args, input, options }) => {
  const params = {
    TableName: getTableName({ table: args.joinTable }, options),
    IndexName: args.index,
    ExpressionAttributeValues: {
      ':v1': {
        S: input[args.key || 'id']
      }
    },
    KeyConditionExpression: `${args.primaryKey} = :v1`
  };

  return dynamoPromise(dynamodb, 'query', params)
    .then(normalizeResponseArray)
    .then((items: any) =>
      Promise.all(
        items.map((item) =>
          get({
            dynamodb,
            args: {
              table: args.table
            },
            data: {
              id: item[args.foreignKey]
            }
          })
        )
      ).then((items) => ({
        items
      }))
    );
};

const queryTable = ({ dynamodb, args, input, options }) => {
  const params = {
    TableName: getTableName(args, options),
    IndexName: args.index,
    ExpressionAttributeValues: {
      ':v1': {
        S: input[args.key || 'id']
      }
    },
    KeyConditionExpression: `${args.primaryKey} = :v1`
  };

  return dynamoPromise(dynamodb, 'query', params)
    .then(normalizeResponseArray)
    .then((items) => ({
      items
    }));
};

export const query = ({ dynamodb, args, input, options }) => {
  // Many to many relationships with a join table
  if (args.joinTable) {
    return queryJoinTable({ dynamodb, args, input, options });
  }

  // One to many relationships with an index
  return queryTable({ dynamodb, args, input, options });
};
