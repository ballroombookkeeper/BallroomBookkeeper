// Imports
const express = require('express')
const fs = require('fs')
const Validator = require('jsonschema').Validator;

// Config
const configSchema = JSON.parse(fs.readFileSync('src/config.schema.json'));
const config = JSON.parse(fs.readFileSync('src/config.json'));
const configValidator = new Validator();

if (!configValidator.validate(config, configSchema).valid) {
    console.log('Config is malformed');
    process.exit();
}

const port = config.server.port ?? 8080;

const app = express();

// Server setup
app.get('/', (req, res) => {
    res.send('Ballroom Bookkeeper')
});

app.listen(port, () => {
    console.log('Server listening on port ' + port)
});
