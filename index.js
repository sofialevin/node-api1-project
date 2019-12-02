// implement your API here

const express = require('express');

const db = require('./data/db.js');

const server = express();

server.use(express.json());

server.get('/', (req, res) => {
    res.send({ api: 'up and running...'})
});

server.post('/api/users', (req, res) => {
    const userData = req.body;

    if (userData.name && userData.bio) {
        db.insert(userData)
            .then(user => {
                db.findById(user.id)
                .then(user => {
                    res.status(201).json(user)
                })
            })
            .catch(err => {
                console.log("error on POST /api/users", err);
                res.status(500).json({ error: "Error creating user."})
            })
    } else {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})
    }
})

server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        console.log("error on GET /api/users", err);
        res.status(500).json({ error: "Error getting users."})
    })
})

const port = 4000;
server.listen(port, () => 
    console.log(`\n ** API running on port ${port} **\n`)
);