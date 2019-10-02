import { normalizeResponseArray, getTableName } from '../util';

export const scan = ({ dynamodb, args, options }) => {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: getTableName(args, options)
    };
    return dynamodb.scan(params, (err, res) => {
      if (err) {
        return reject(err);
      }

      // Scan the entire table
      return resolve({
        items: normalizeResponseArray(res)
      });
    });
  });
};
