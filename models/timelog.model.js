const timelogDatabase = require('../models/timelog.mongo');

async function createTimeLog(timelog){
    return await timelogDatabase.create(timelog);
}

async function getTimelogs(filter){
    return await timelogDatabase.find(filter);
}

async function getTimelogById(id){
    return await timelogDatabase.findById(id);
}

async function updateTimelogById(id, modifiedInfo){
    return await timelogDatabase.findOneAndUpdate( {_id:id}, modifiedInfo, {new:true});
}

async function deleteTimelogById(id){
    return await timelogDatabase.findOneAndDelete({_id:id});
}

module.exports = {
    createTimeLog,
    getTimelogs,
    updateTimelogById,
    getTimelogById,
    deleteTimelogById,
}