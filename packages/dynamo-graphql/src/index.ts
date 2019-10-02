import { SchemaDirectiveVisitor } from 'apollo-server';
import { createConnection } from './config/createConnection';
import { resolverTypes } from './resolverTypes';

export * from './config/schemaDirective';
export * from './util/dynamoPromise';

export * from './config/createConnection';

export const createDynamoSchema = (options) => {
  const connection = createConnection(options);

  return class DynamoDirective extends SchemaDirectiveVisitor {
    public visitFieldDefinition(field) {
      field.resolve = (input = {}, data = {}, ctx = {}, definition = {}) => {
        const resolverType =
          resolverTypes[this.args.action] || resolverTypes.scan;

        return resolverType({
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
      console.log('::ARGS2', this.args);
      field.resolve = () => [];
    }
  };
};
