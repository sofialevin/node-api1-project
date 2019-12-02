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
                res.status(500).json({ error: "There was an error while saving the user to the database"})
            })
    } else {
        res.status(400).json({error: "Please provide name and bio for the user."})
    }
})

server.get('/api/users', (req, res) => {
    db.find()
    .then(users => {
        res.status(200).json(users)
    })
    .catch(err => {
        console.log("error on GET /api/users", err);
        res.status(500).json({ error: "The users information could not be retrieved."})
    })
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id

    db.findById(id)
    .then(user => {
        if (user) {
            res.status(200).json(user)
        } else {
            res.status(404).json({ error: "The user with the specified ID does not exist."})
        }
    })
    .catch(err => {
        console.log(`error on GET /api/users/${id}`, err);
        res.status(500).json({ error: "The user information could not be retrieved."})
    })
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id

    db.remove(id)
    .then(user => {
        if (user) {
            res.status(204).end();
        } else {
            res.status(404).json({ error: "The user with the specified ID does not exist."})
        }
    })
    .catch(err => {
        console.log(`error on DELETE /api/users/${id}`, err);
        res.status(500).json({ error: "The user could not be removed."})
    })
})

const port = 4000;
server.listen(port, () => 
    console.log(`\n ** API running on port ${port} **\n`)
);