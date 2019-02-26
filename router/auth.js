const userDB = require('../data/dbConfig');
const bcrypt = require('bcryptjs');
const router = require('express').Router();


router.post('/register', (req, res, next) => {
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
router.post('/login', async (req, res, next) => {
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


module.exports = router;