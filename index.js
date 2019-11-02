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

    if (!newUser.name || !newUser.bio) {
        res.status(400).json(
            {
                success: false,
                errorMessage: "Please provide name and bio for the user."
            }
        )
    } else {
        db.insert(newUser)
        .then(user => 
            db.findById(user.id)
            .then(user =>
                res.status(201).json(
                {
                    success: true,
                    user: user
                }
            )
        ))
        .catch(() => res.status(500).json(
            {
                success: false,
                error: "There was an error while saving the user to the database"
            }
        ))
    }
})

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => res.status(200).json(
            {
                users: users
            }
        ))
        .catch(() => res.status(500).json(
            {
                error: "The users information could not be retrieved."
            }
        ))
})

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json(
                    {
                        success: true,
                        user
                    }
                ) 
            } else {
                res.status(404).json(
                    {
                        success: false,
                        message: "The user with the specified ID does not exist."
                    }
                )
            }
        })
        .catch(() => res.status(500).json(
            {
                error: "The user information could not be retrieved."
            }
        ))
})

server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(deletedUser => {
             if (deletedUser) {
                res.status(204).end()
             } else {
                res.status(404).json(
                    {
                        success: false,
                        message: "The user with the specified ID does not exist."
                    }
                )
            }
        })
        .catch(() => res.status(500).json(
            {
                error: "The user could not be removed"
            }
        ))
})

server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body
    db.update(id, updatedUser)
        .then(user => {
           if (!user) {
            res.status(404).json(
                {
                    success: false,
                    message: "The user with the specified ID does not exist."
                }
            )
        } else if (!updatedUser.name || !updatedUser.bio) {
            res.status(400).json(
                {
                    success: false,
                    errorMessage: "Please provide name and bio for the user."
                }
            )
        } else {
            db.findById(id)
            .then(user => {
                res.status(200).json(
                    {
                        success: true,
                        user: user
                    }
                )
            })
        }
    })
    .catch(() => res.status(500).json(
        {
            success: false,
            error: "The user information could not be modified."
        }
    ))
})