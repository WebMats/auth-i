const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const knexConfig = require('./knexfile');
const bcrypt = require('bcryptjs');
const app = express();

const userDB = knex(knexConfig.development)

app.use(express.json())
app.use(helmet());

app.post('/api/register', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json({errorMessage: "Please provide both an email and a password to create a new user"});
    }
    bcrypt.hash(password, 11).then( async (hash) => {
        const newUser = {email, hash}
        const [id] = await userDB('users').insert(newUser);
        res.status(201).json(id);
    }).catch(err => {
       console.log(err)
       res.status(500).json({errorMessage: "Could not register the user."})
    });
})
app.post('/api/login', async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json({errorMessage: "Please provide both an email and a password to create a new user"});
    }
    const { id, hash } = await userDB('users').where({email}).first();
    if (!hash) {
        return res.status({errorMessage: "Could not authenticate user."})
    }
    bcrypt.compare(password, hash).then(isMatch => {
        if (isMatch) {
            res.status(201).json({id, email, status: 'Logged in'}) 
        } else {
            res.status(404).json({errorMessage: "Could not authenticate user."})
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({errorMessage: "Could not authenticate user."})
    });
})
app.get('/api/users', async (req, res, next)=> {
    try {
        const users = await userDB('users');
        if (!users || !users.length) {
            res.status(404).json({errorMessage: "There are no users in the database."})
        } else {
            res.status(201).json(users)
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({errorMessage: "Could not fetch users."})
    }
})


app.listen(4200, () => {console.log('Listening at port 4200...')})