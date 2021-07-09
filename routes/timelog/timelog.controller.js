 const path = require('path');
 const moment = require('moment');
 
 const{
     createTimeLog,
     getTimelogs,
     getTimelogById,
     updateTimelogById,
     deleteTimelogById,
 } = require('../../models/timelog.model');

 const{
     isTokenValid,
     getTokenData,
     checkIsSpecificRole,
 } = require('../../services/JWTServices');

async function httpCreateTimelog(req, res){
    if(!isTokenValid(req)){
        return res.status(401).json({"error": "You must be logged in!"});
    }
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    const currentUser = getTokenData(token).payload;
    const timelog = {...req.body};
    timelog.date = new Date(timelog.date);
    timelog.userId = currentUser._id;
    
    if( req.body.userId !== undefined && checkIsSpecificRole(req,'admin') ) timelog.userId = req.body.userId;
    
    const createdTimelog =  await createTimeLog(timelog);
    return res.json(createdTimelog);
}

async function httpGetTimelogs(req, res){
    if(!isTokenValid(req)){
    return res.status(401).json({"error": "You must be logged in!"});
    }
    const from = req.query.from? req.query.from : new Date("01/01/1000");
    const to = req.query.to? req.query.to: new Date("01/01/10000");

    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    const currentUser = getTokenData(token).payload;
    let userId;
    if(currentUser.role === 'admin'){
        userId = req.query.user_id ? req.query.user_id : null;
    }
    else userId = currentUser._id;

    if(userId!==null)
        timelogs = await getTimelogs({"userId":userId, date:{"$gte": from, "$lte":to} });
    else 
        timelogs = await getTimelogs({ date:{"$gte":from, "$lte": to} });
    
    formattedDates = []
    for(var i in timelogs){
        formattedDates[i] = moment(timelogs[i].date).format('YYYY.MM.DD');
    }

    return res.render('pages/timelogs', {timelogs:timelogs, formattedDates:formattedDates } );
}

async function httpUpdateTimelogById(req, res){
    if(!isTokenValid(req)) 
        return res.status(401).json({"error": "You must be logged in!"});

    const timelogId = req.params.time_log_id;
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    const currentUser = getTokenData(token).payload;
    const dbTimelogId = await getTimelogById(timelogId);
    
    if(!checkIsSpecificRole(req, 'admin') && dbTimelogId.userId!==currentUser._id )
        return res.status(401).json({"error": "You don't have permission to perform this action!"});
    
    let modifiedInfo = {};
    const changes = {...req.body};
    if(changes.notes!==undefined) modifiedInfo.notes = changes.notes;
    if(changes.date!==undefined) modifiedInfo.date = changes.date;
    if(changes.time!==undefined) modifiedInfo.time = changes.time;

    const updatedTimelog = await updateTimelogById(timelogId, modifiedInfo);
    
    if(updatedTimelog===null) return res.status(404).json("Timelog with specified id doesn't exist!");
    
    return res.json(updatedTimelog);
}

async function httpDeleteTimelogById(req, res){
    if(!isTokenValid(req)) 
        return res.status(401).json({"error": "You must be logged in!"});
    
    const timelogId = req.params.time_log_id;
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    const currentUser = getTokenData(token).payload;
    const timelog = await getTimelogById(timelogId);
    
    if(timelog === null || timelog===undefined){
        return res.status(404).json({"error":"Timelog with specified id does not exist"});
    }
    
    if(!checkIsSpecificRole(req, 'admin') && timelog.userId!==currentUser._id )
        return res.status(401).json({"error": "You don't have permission to perform this action!"});
    
    const deletedTimelog = await deleteTimelogById(timelogId);    
    res.json(deletedTimelog);
}



module.exports = {
    httpCreateTimelog,
    httpGetTimelogs,
    httpUpdateTimelogById,
    httpDeleteTimelogById,
}