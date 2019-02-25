const express = require('express');
const helmet = require('helmet');
const knex = require('knex');
const cors = require('cors');
const knexConfig = require('./knexfile');
const bcrypt = require('bcryptjs');
const app = express();

const userDB = knex(knexConfig.development)
const authGuard = require('./middleware/auth');
app.use(express.json())
app.use(helmet());
app.use(cors());

app.use('/api/restricted/', [authGuard]) 

app.post('/api/register', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json({errorMessage: "Please provide both an email and a password to create a new user"});
    }
    bcrypt.hash(password, 11).then( async (hash) => {
        const newUser = {email, hash}
        try {
            const [id] = await userDB('users').insert(newUser);
            res.status(201).json({id, email, status: 'Logged in'});
        } catch (err) {
            console.log(err)
            res.status(500).json({errorMessage: "Could not register the user."})
        }
    }).catch(err => {
       console.log(err)
       res.status(500).json({errorMessage: "Could not register the user."})
    });
})
app.post('/api/login', async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json({errorMessage: "Please provide both an email and a password for user"});
    }
    const user = await userDB('users').where({email}).first();
    if (!user) {
        return res.status(404).json({errorMessage: "Could not authenticate user."})
    }
    const { id, hash } = user;
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

app.get('/api/users', authGuard, async (req, res, next)=> {
    if (!req.isAuth) {
        return res.status(500).json({errorMessage: 'You must be logged in to access this endpoint'})
    }
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


app.listen(4400, () => {console.log('Listening at port 4400...')})