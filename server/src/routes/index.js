const express = require('express');
const router = express.Router();
const authRouter = require('./auth');
const {isLogin} = require('../middlewares/auth')


router.use('/auth' , authRouter);


module.exports = router