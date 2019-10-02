const getType = item => {
  if (typeof item === 'boolean') {
    return 'BOOL';
  }

  if (typeof item === 'number') {
    return 'N';
  }

  return 'S';
};

const parseType = (item: string) => {
  if (typeof item === 'number') {
    return String(item);
  }

  return item;
};

export const buildPutItems = data =>
  Object.keys(data).reduce((prev, current) => {
    return {
      ...prev,
      [current]: {
        [getType(data[current])]: parseType(data[current]),
      },
    };
  }, {});
