import { getTableName } from '../util';

export const destroy = ({ dynamodb, args, data, options }) => {
  return new Promise((resolve) => {
    const id = data[args.key || 'id'];
    const params = {
      TableName: getTableName(args, options),
      Key: {
        [args.key || 'id']: {
          S: id
        }
      }
    };

    return dynamodb.deleteItem(params, (err) => {
      if (err) {
        return resolve({
          code: err.code,
          message: err.message
        });
      }

      return resolve({
        code: 'OK',
        item: {
          id
        }
      });
    });
  });
};
