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

server.post('/api/users', (req, res) => {
    const newUser = req.body;

    !newUser.name || !newUser.bio
    ? res.status(400).json(
        {
            success: false,
            errorMessage: "Please provide name and bio for the user."
        }
    )
    : db.insert(newUser)
        .then(user => res.status(201).json(
            {
                success: true,
                user
            }
        ))
        .catch(err => res.status(500).json(
            {
                success: false,
                err
            }
        ))
})