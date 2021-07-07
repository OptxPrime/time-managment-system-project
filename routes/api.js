const express = require('express');
const authRouter = require('./auth/auth.router');
const usersRouter = require('./users/users.router');
const timelogsRouter = require('./timelog/timelog.router');


const api = express.Router();

api.use('/auth', authRouter);
api.use('/users', usersRouter);
api.use('/time-logs', timelogsRouter);

module.exports = api;