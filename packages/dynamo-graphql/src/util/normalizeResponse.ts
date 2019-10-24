export const normalizeResponseItem = (item) => {
  if (!item) {
    return {};
  }

  return Object.keys(item).reduce((prev, key) => {
    return {
      ...prev,
      [key]: item[key].L
        ? item[key].L.map((res) =>
            res.M ? normalizeResponseItem(res.M) : res[Object.keys(res)[0]]
          )
        : item[key].M
        ? normalizeResponseItem(item[key].M)
        : item[key][Object.keys(item[key])[0]]
    };
  }, {});
};

export const normalizeResponseArray = (data) =>
  data.Items.map(normalizeResponseItem);
