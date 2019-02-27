const userDB = require('../data/dbConfig');
const bcrypt = require('bcryptjs');
const router = require('express').Router();
const passport = require('passport');


router.post('/register', passport.authenticate('local.signup'),(req, res, next) => {
    res.status(200).json('Signup Success')
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