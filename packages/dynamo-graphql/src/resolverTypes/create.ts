import * as uuid from 'uuid/v4';

import { buildPutItems, getTableName } from '../util';
import { get } from './get';

export const create = ({ dynamodb, args, data, options }) => {
  return new Promise((resolve, reject) => {
    const id = uuid();
    const params = {
      TableName: getTableName(args, options),
      Item: {
        [args.key || 'id']: {
          S: id
        },
        ...buildPutItems(data.input)
      }
    };

    return dynamodb.putItem(params, (err) => {
      if (err) {
        return reject(err);
      }

      return get({
        dynamodb,
        args,
        data: {
          id
        }
      }).then((item) =>
        resolve({
          item,
          code: 'OK',
          message: null
        })
      );
    });
  });
};
