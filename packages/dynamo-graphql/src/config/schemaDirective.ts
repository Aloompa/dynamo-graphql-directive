export const schemaDirective = `
  directive @dynamo(
    table: String!
    index: String
    action: String
    foreignKey: String
    joinTable: String
    primaryKey: String
    comparator: String
  ) on OBJECT | FIELD_DEFINITION
`;
