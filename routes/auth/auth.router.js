const express = require('express');

const {
  httpRegisterUser,
  httpLogInUser,
  httpWhoAmI
} = require('./auth.controller');

const authRouter = express.Router();

authRouter.post('/register', httpRegisterUser);
authRouter.post('/login', httpLogInUser);
authRouter.get('/me', httpWhoAmI);

module.exports = authRouter;