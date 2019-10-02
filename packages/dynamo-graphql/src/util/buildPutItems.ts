const getType = (item) => {
  if (typeof item === 'boolean') {
    return 'BOOL';
  }

  if (typeof item === 'number') {
    return 'N';
  }

  if (Array.isArray(item)) {
    return 'L';
  }

  if (typeof item === 'object') {
    return 'M';
  }

  return 'S';
};

const parseType = (item: string) => {
  if (typeof item === 'number') {
    return String(item);
  }

  if (Array.isArray(item)) {
    return item.map((obj) =>
      typeof obj === 'object'
        ? { M: buildPutItems(obj) }
        : {
            [getType(obj)]: parseType(obj)
          }
    );
  }

  if (typeof item === 'object') {
    return buildPutItems(item);
  }

  return item;
};

export const buildPutItems = (data) => {
  return Object.keys(data).reduce((prev, current) => {
    return {
      ...prev,
      [current]: {
        [getType(data[current])]: parseType(data[current])
      }
    };
  }, {});
};
