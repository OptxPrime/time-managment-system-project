const {isTokenValid} = require('../services/JWTServices');

function tokenValidation(req,res, next){
    if(!isTokenValid(req)) res.status(401).send({"error": "You must be logged in!"});
    else{
        next();
    }
}

module.exports = tokenValidation;