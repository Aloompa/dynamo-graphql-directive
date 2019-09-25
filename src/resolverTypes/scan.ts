import {normalizeResponseArray} from '../util/normalizeResponse';

export const scan = ({dynamodb, args}) => {
  return new Promise((resolve, reject) => {
    const options = {
      TableName: args.table,
    };
    return dynamodb.scan(options, (err, res) => {
      if (err) {
        return reject(err);
      }

      // Scan the entire table
      return resolve({
        items: normalizeResponseArray(res),
      });
    });
  });
};
