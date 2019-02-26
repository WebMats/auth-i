const userDB = require('../data/dbConfig');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const passport = require('passport');


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
router.post('/login', passport.authenticate('local.signin'), async (req, res, next) => {
    res.status(200).json('Authenticated')
})
router.get('/logout', async (req, res, next) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {

            } else {
                res.send('bye')
            }
        })
    } else {
        res.end()
    }
})


module.exports = router;