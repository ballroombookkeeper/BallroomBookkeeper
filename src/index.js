// Imports
const express = require('express')
const fs = require('fs')

// Config
const config = JSON.parse(fs.readFileSync('src/config.json'));
const port = config.port;

const app = express();

// Server setup
app.get('/', (req, res) => {
    res.send('Ballroom Bookkeeper')
});

app.listen(port, () => {
    console.log('Server listening on port ' + port)
});
