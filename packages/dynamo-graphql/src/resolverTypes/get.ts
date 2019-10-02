import {normalizeResponseItem} from '../util/normalizeResponse';

export const get = ({dynamodb, args, data, input}: any) => {
  if (args.foreignKey && !input[args.foreignKey]) {
    return Promise.resolve({});
  }

  return new Promise((resolve, reject) => {
    const options = {
      TableName: args.table,
      Key: {
        [args.key || 'id']: {
          S: args.foreignKey ? input[args.foreignKey] : data[args.key || 'id'],
        },
      },
    };

    return dynamodb.getItem(options, (err, res) => {
      if (err) {
        return reject(err);
      }

      return resolve(normalizeResponseItem(res.Item));
    });
  });
};
