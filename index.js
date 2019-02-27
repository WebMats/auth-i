const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');

const sessionConfig = {
    name: 'lambda-authentication',
    secret: process.env.COOKIE_SECRET,
    cookie: { maxAge: 1000 * 60 * 20 },
    resave: false,
    saveUninitialized: false
}
require('./services/passport');
const app = express();
const authGuard = require('./middleware/auth');
app.use(express.json())
app.use(helmet());
app.use(cors());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

const userRouter = require('./router/user');
const authRouter = require('./router/auth');

app.use('/api/restricted/', [authGuard]) 
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter);




app.listen(4400, () => {console.log('Listening at port 4400...')})