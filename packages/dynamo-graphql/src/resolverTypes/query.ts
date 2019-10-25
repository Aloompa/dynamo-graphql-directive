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
    ExpressionAttributeNames: {
      '#S': args.primaryKey
    },
    KeyConditionExpression: `#S = :v1`
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

const getConditionForComparator = (comparator) => {
  const comparisonTypes = {
    BETWEEN: `#S BETWEEN :v1 AND :v2`,
    BEGINS_WITH: 'begins_with ( #S, :v1 )',
    EQ: '#S = :v1',
    LT: '#S < :v1',
    LTE: '#S <= :v1',
    GT: '#S > :v1',
    GTE: '#S >= :v1'
  };

  return comparisonTypes[comparator] || comparisonTypes.EQ;
};

const queryTable = ({ dynamodb, args, input, options, data }) => {
  const params = {
    TableName: getTableName(args, options),
    IndexName: args.index,
    ExpressionAttributeValues: {
      ':v1': {
        S: data.min || data.query || input[args.key || 'id']
      },
      ':v2':
        data.max !== undefined
          ? {
              S: data.max
            }
          : undefined
    },
    ExpressionAttributeNames: {
      '#S': args.primaryKey
    },
    KeyConditionExpression: getConditionForComparator(args.comparator)
  };

  return dynamoPromise(dynamodb, 'query', params)
    .then(normalizeResponseArray)
    .then((items) => ({
      items
    }));
};

export const query = ({ dynamodb, args, input, options, data }) => {
  // Many to many relationships with a join table
  if (args.joinTable) {
    return queryJoinTable({ dynamodb, args, input, options });
  }

  // One to many relationships with an index
  return queryTable({ dynamodb, args, input, options, data });
};
