import { SchemaDirectiveVisitor } from 'graphql-tools';
import { createConnection } from './config/createConnection';
import { resolverTypes } from './resolverTypes';

export * from './config/schemaDirective';
export * from './util/dynamoPromise';

export * from './config/createConnection';

interface DynamoSchemaOptions {
  tablePrefix?: string;
}

export const createDynamoSchema = (
  awsConfig,
  options: DynamoSchemaOptions = {}
) => {
  const connection = createConnection(awsConfig);

  return class DynamoDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition(field) {
      field.resolve = (input = {}, data = {}, ctx = {}, definition = {}) => {
        const resolverType =
          resolverTypes[this.args.action] || resolverTypes.scan;

        return resolverType({
          options,
          input,
          ctx,
          dynamodb: connection,
          args: this.args,
          data: data || {},
          definition
        });
      };
    }

    public visitObject(field) {
      field.resolve = () => [];
    }
  };
};
