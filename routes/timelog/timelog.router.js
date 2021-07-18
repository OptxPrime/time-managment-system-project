const express = require('express');
const tokenValidation = require('../../middleware/tokenValidation');
const {
  httpCreateTimelog, httpGetTimelogs, httpUpdateTimelogById, httpDeleteTimelogById,
} = require('./timelog.controller');

const timelogsRouter = express.Router();
timelogsRouter.use(tokenValidation)


timelogsRouter.get('/', httpGetTimelogs);
timelogsRouter.post('/', httpCreateTimelog);
timelogsRouter.patch('/:time_log_id', httpUpdateTimelogById);
timelogsRouter.delete('/:time_log_id', httpDeleteTimelogById);


module.exports = timelogsRouter;