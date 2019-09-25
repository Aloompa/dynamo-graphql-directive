export const schemaDirective = `
  directive @dynamo(
    table: String!
    index: String
    action: String
    foreignKey: String
  ) on OBJECT | FIELD_DEFINITION
`;
