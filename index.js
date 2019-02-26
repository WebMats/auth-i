const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const authGuard = require('./middleware/auth');
app.use(express.json())
app.use(helmet());
app.use(cors());

const userRouter = require('./router/user');
const authRouter = require('./router/auth');

app.use('/api/restricted/', [authGuard]) 
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter);




app.listen(4400, () => {console.log('Listening at port 4400...')})