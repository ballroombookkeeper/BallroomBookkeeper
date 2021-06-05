// Imports
import express from 'express';
import fs from 'fs';
import jsonschema from 'jsonschema';
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

const DEFAULT_SERVER_PORT = 8080;

type ServerArguments = {
    config: string
}

type ServerConfig = {
    server: {
        port?: number
    }
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

// Server setup
app.get('/', (req, res) => {
    res.send('Ballroom Bookkeeper')
});

app.listen(port, () => {
    console.log('Server listening on port ' + port)
});