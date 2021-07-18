const express = require('express');
const {
  httpGetAllUsers, httpCreateUser, httpGetUserById, httpUpdateUserById, httpDeleteUserById, httpUpdateSettingsById,
} = require('./users.controller');

const tokenValidation = require('../../middleware/tokenValidation');

const usersRouter = express.Router();
usersRouter.use(tokenValidation);

usersRouter.get('/:user_id', httpGetUserById);
usersRouter.get('/', httpGetAllUsers);
usersRouter.post('/', httpCreateUser);
usersRouter.patch('/:user_id', httpUpdateUserById);
usersRouter.delete('/:user_id', httpDeleteUserById);
usersRouter.patch('/:user_id/settings', httpUpdateSettingsById);


module.exports = usersRouter;