const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const app = express();

app.use(express.json())
app.use(helmet());

app.post('/api/register', (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(404).json({errorMessage: "Please provide both an email and a password to create a new user"});
    }
    try {
        bcrypt.hash(password, 11).then(hash => {
            const newUser = {email, hash}
            res.status(201).json(newUser);
        }).catch(err => {
           console.log(err)
           res.status(500).json({errorMessage: "Could not register the user."})
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({errorMessage: "Could not register the user."})
    }
})
app.post('/api/login', (req, res, next) => {

})
app.get('/api/users', (req, res, next)=> {

})


app.listen(4200, () => {console.log('Listening at port 4200...')})