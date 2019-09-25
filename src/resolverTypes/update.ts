import {buildPutItems} from '../util/buildPutItems';
import {get} from './get';

export const update = ({dynamodb, args, data}) => {
  return new Promise(resolve => {
    const id = data[args.key || 'id'];

    return get({
      dynamodb,
      args,
      data: {
        [args.key || 'id']: id,
      },
    }).then(existingItem => {
      if (!existingItem) {
        return resolve({
          item: null,
          code: 'NOT_FOUND',
          message: 'The record does not exist',
        });
      }

      const options = {
        TableName: args.table,
        Item: buildPutItems({
          ...existingItem,
          ...data,
        }),
      };

      return dynamodb.putItem(options, err => {
        if (err) {
          return resolve({
            item: null,
            code: err.code,
            message: err.message,
          });
        }

        return resolve({
          item: {
            ...existingItem,
            ...data,
          },
          code: 'OK',
          message: null,
        });
      });
    });
  });
};
