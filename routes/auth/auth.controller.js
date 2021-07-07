const bcrypt = require('bcryptjs');

const { 
  registerUser,
  logInUser
 } 
 = require('../../models/users.model');

const { 
    getConfigurations,
    generateToken,
    getTokenData,
    isTokenValid,
   } 
   = require('../../services/JWTServices');

async function httpRegisterUser(req, res) {
  const passwordHash = bcrypt.hashSync(req.body.password, 10);
  
  const user = { 
      name: req.body.name,
      surname: req.body.surname,
      email: req.body.email,
      password: passwordHash,
      role: "admin"
   }

  return res.json(await registerUser(user));
}


async function httpLogInUser( req, res ){
  const user = await logInUser({ email: req.body.email, password: req.body.password });

  if(user!==undefined){
  const configurations = getConfigurations({ email: user.email, role: user.role, _id:user._id });
  const token = generateToken(configurations);
  res.json({ "user": user, "token":token });
  }else{
    res.json({"error": "Invalid credentials"});
  }
}

function httpWhoAmI(req, res){
  if(!isTokenValid(req)) 
    res.status(401).json({"error": "You must be logged in!"});
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
  const tokenData = getTokenData(token).payload;
  const userInfo = { "email": tokenData.email, "role": tokenData.role, "settings": tokenData.settings };
  res.json(userInfo);
}

module.exports = {
    httpRegisterUser,
    httpLogInUser,
    httpWhoAmI,
};