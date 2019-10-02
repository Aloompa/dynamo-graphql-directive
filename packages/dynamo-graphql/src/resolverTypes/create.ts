import * as uuid from 'uuid/v4';

import {buildPutItems} from '../util/buildPutItems';
import {get} from './get';

export const create = ({dynamodb, args, data}) => {
  return new Promise((resolve, reject) => {
    const id = uuid();
    const options = {
      TableName: args.table,
      Item: {
        [args.key || 'id']: {
          S: id,
        },
        ...buildPutItems(data),
      },
    };

    return dynamodb.putItem(options, err => {
      if (err) {
        return reject(err);
      }

      return get({
        dynamodb,
        args,
        data: {
          id,
        },
      }).then(item =>
        resolve({
          item,
          code: 'OK',
          message: null,
        })
      );
    });
  });
};
