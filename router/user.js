const userDB = require('../data/dbConfig');
const router = require('express').Router();
const authGuard = require('../middleware/auth');

module.exports = router.get('', authGuard, async (req, res, next)=> {
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