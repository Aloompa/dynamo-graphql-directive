export const normalizeResponseItem = item => {
  if (!item) {
    return {};
  }

  return Object.keys(item).reduce((prev, key) => {
    return {
      ...prev,
      [key]: item[key][Object.keys(item[key])[0]],
    };
  }, {});
};

export const normalizeResponseArray = data =>
  data.Items.map(normalizeResponseItem);
