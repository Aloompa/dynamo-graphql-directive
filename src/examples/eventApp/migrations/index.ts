import * as fs from 'fs';

import {createConnection} from '../../../config/createConnection';

const migrationsList = fs.readdirSync(__dirname);

const runMigrationsSync = (migrationsList, dynamo) => {
  const [currentMigration, ...remainingMigrations] = migrationsList;

  const migrate = require(`./${currentMigration}`);

  console.log(`Running ${currentMigration}...`);

  return migrate(dynamo)
    .then(() => {
      console.log(`Successfully ran ${currentMigration}.`);

      if (remainingMigrations.length) {
        return runMigrationsSync(remainingMigrations, dynamo);
      }
    })
    .catch(err => {
      console.log(`There was an error while running ${currentMigration}!!!`);
      console.log(err);
    });
};

const migrations = () => {
  const dynamo = createConnection({
    endpoint: 'http://localhost:8000',
  });

  return runMigrationsSync(
    migrationsList.filter(migration => migration !== 'index.ts'),
    dynamo
  );
};

migrations();
