export const destroy = ({dynamodb, args, data}) => {
  return new Promise(resolve => {
    const id = data[args.key || 'id'];
    const options = {
      TableName: args.table,
      Key: {
        [args.key || 'id']: {
          S: id,
        },
      },
    };

    return dynamodb.deleteItem(options, err => {
      if (err) {
        return resolve({
          code: err.code,
          message: err.message,
        });
      }

      return resolve({
        code: 'OK',
        item: {
          id,
        },
      });
    });
  });
};
