const db = require('./data/db');
const express = require('express');

const server = express();

server.listen(4000, () => {
    console.log('=== server listening on port 4000 ===');
});

server.use(express.json());

server.get('/', (request, response) => {
    response.send('hello world...');
});
