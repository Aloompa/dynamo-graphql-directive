import { buildPutItems, getTableName } from '../util';
import { get } from './get';

export const update = ({ dynamodb, args, data, options }) => {
  return new Promise((resolve) => {
    const id = data[args.key || 'id'];

    return get({
      dynamodb,
      args,
      data: {
        [args.key || 'id']: id
      }
    }).then((existingItem) => {
      if (!existingItem) {
        return resolve({
          item: null,
          code: 'NOT_FOUND',
          message: 'The record does not exist'
        });
      }

      const params = {
        TableName: getTableName(args, options),
        Item: buildPutItems({
          ...existingItem,
          ...data.input
        })
      };

      return dynamodb.putItem(params, (err) => {
        if (err) {
          return resolve({
            item: null,
            code: err.code,
            message: err.message
          });
        }

        return resolve({
          item: {
            ...existingItem,
            ...data.input
          },
          code: 'OK',
          message: null
        });
      });
    });
  });
};
