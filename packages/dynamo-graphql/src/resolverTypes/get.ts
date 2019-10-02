import { normalizeResponseItem, getTableName } from '../util';

export const get = ({ dynamodb, args, data, input, options }: any) => {
  if (args.foreignKey && !input[args.foreignKey]) {
    return Promise.resolve({});
  }

  return new Promise((resolve, reject) => {
    const params = {
      TableName: getTableName(args, options),
      Key: {
        [args.key || 'id']: {
          S: args.foreignKey ? input[args.foreignKey] : data[args.key || 'id']
        }
      }
    };

    return dynamodb.getItem(params, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(normalizeResponseItem(res.Item));
    });
  });
};
