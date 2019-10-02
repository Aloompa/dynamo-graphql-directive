import { dynamoPromise } from '../dynamoPromise';

describe('Dynamo Promises', () => {
  it('Should resolve a callback to a promise', () => {
    const fakePromise = (input, callback) => {
      return callback(null, input);
    };

    const dynamo = {
      fakePromise
    };

    return dynamoPromise(dynamo, 'fakePromise', { foo: 'bar' }).then(
      (res: any) => {
        expect(res.foo).toEqual('bar');
      }
    );
  });

  it('Should resolve an error callback to a promise', () => {
    const fakePromise = (input, callback) => {
      return callback(input, null);
    };

    const dynamo = {
      fakePromise
    };

    return dynamoPromise(dynamo, 'fakePromise', { no: 'sir' }).catch(
      (res: any) => {
        expect(res.no).toEqual('sir');
      }
    );
  });
});
