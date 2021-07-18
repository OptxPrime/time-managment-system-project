const express = require('express');

const tokenValidation = require('../../middleware/tokenValidation');
const {
  httpRegisterUser,
  httpLogInUser,
  httpWhoAmI
} = require('./auth.controller');

const authRouter = express.Router();

authRouter.post('/register', httpRegisterUser);
authRouter.post('/login', httpLogInUser);
authRouter.get('/me', tokenValidation, httpWhoAmI);

module.exports = authRouter;