export const dynamoPromise = (dynamo, method, params) => {
  return new Promise((resolve, reject) => {
    return dynamo[method](params, (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    });
  });
};
