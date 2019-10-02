import {dynamoPromise} from '../util/dynamoPromise';
import {get} from './get';
import {normalizeResponseArray} from '../util/normalizeResponse';

const queryJoinTable = ({dynamodb, args, input}) => {
  const options = {
    TableName: args.joinTable,
    IndexName: args.index,
    ExpressionAttributeValues: {
      ':v1': {
        S: input[args.key || 'id'],
      },
    },
    KeyConditionExpression: `${args.primaryKey} = :v1`,
  };

  return dynamoPromise(dynamodb, 'query', options)
    .then(normalizeResponseArray)
    .then((items: any) =>
      Promise.all(
        items.map(item =>
          get({
            dynamodb,
            args: {
              table: args.table,
            },
            data: {
              id: item[args.foreignKey],
            },
          })
        )
      ).then(items => ({
        items,
      }))
    );
};

const queryTable = ({dynamodb, args, input}) => {
  const options = {
    TableName: args.table,
    IndexName: args.index,
    ExpressionAttributeValues: {
      ':v1': {
        S: input[args.key || 'id'],
      },
    },
    KeyConditionExpression: `${args.primaryKey} = :v1`,
  };

  return dynamoPromise(dynamodb, 'query', options)
    .then(normalizeResponseArray)
    .then(items => ({
      items,
    }));
};

export const query = ({dynamodb, args, input}) => {
  // Many to many relationships with a join table
  if (args.joinTable) {
    return queryJoinTable({dynamodb, args, input});
  }

  // One to many relationships with an index
  return queryTable({dynamodb, args, input});
};
