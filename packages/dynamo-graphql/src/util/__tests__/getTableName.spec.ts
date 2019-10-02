import { getTableName } from '../getTableName';

describe('Get Table Name', () => {
  it('Should return the table name as is if no prefix is provided', () => {
    const result = getTableName({ table: 'events' }, {});

    expect(result).toEqual('events');
  });

  it('Should prefix the table name', () => {
    const result = getTableName(
      { table: 'events' },
      { getTableName: (name) => `__dev-${name}` }
    );

    expect(result).toEqual('__dev-events');
  });
});
