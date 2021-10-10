// Imports
import express from 'express';
import fs from 'fs';
import jsonschema from 'jsonschema';
import { Pool } from 'pg';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { ApiRouter } from './ApiRouter';
import { ServerConfig } from './types';

const DEFAULT_SERVER_PORT = 8080;

type ServerArguments = {
    config: string
}

// Parse arguments
const args = yargs(hideBin(process.argv))
    .options({
        'config': {
            alias: 'c',
            describe: 'Path to configuration file',
            type: 'string',
            demandOption: true
        }
    })
    .alias('v', 'version')
    .alias('h', 'help')
    .argv as ServerArguments;

// Config
if (!fs.existsSync(args.config)) {
    console.error(`Configuration file ${args.config} is not accessible`);
    process.exit(1);
}

const configSchema = JSON.parse(fs.readFileSync('src/config.schema.json').toString());
const config: ServerConfig = JSON.parse(fs.readFileSync(args.config).toString());
const configValidator = new jsonschema.Validator();
const configValidation = configValidator.validate(config, configSchema);
if (!configValidation.valid) {
    console.log('Config is malformed');
    console.log(configValidation.errors.map(e => e.stack).join('\n'));
    process.exit(1);
}

// Configure Server
const port = config.server.port ?? DEFAULT_SERVER_PORT;
const app = express();
const databaseConfig = config.database;
const dbPool = new Pool({
    user: databaseConfig.user,
    password: databaseConfig.password,
    host: databaseConfig.host,
    database: databaseConfig.dbname,
    port: databaseConfig.port
});

// Server setup
app.use('/api/', new ApiRouter(dbPool).router);
app.use(express.static(config.app.path));
app.listen(port, () => {
    console.log('Server listening on port ' + port);
});