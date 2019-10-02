export const getTableName = ({ table }, options: any = {}) =>
  options.getTableName ? options.getTableName(table) : table;
