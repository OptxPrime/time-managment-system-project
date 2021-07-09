const bcrypt = require('bcryptjs');

const {
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    updateSettingsById,
} = require('../../models/users.model');

const {
    getTokenData,
    isTokenValid,
    checkIsSpecificRole,
} = require('../../services/JWTServices');

 async function httpGetAllUsers(req, res) {
    if( !isTokenValid(req) ) 
     return res.status(401).json({"error": "You must be logged in!"});
  
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    const currentUser = getTokenData(token).payload;
    if(currentUser.role === 'admin' || currentUser.role === 'user manager' ){
    const users = await getAllUsers();
    return res.json(users);
    }else{
      res.status(401).json({"error": "You don't have permission to perform this action!"});
    }
  }

  async function httpCreateUser(req, res){
    if(!isTokenValid(req)) 
      return res.status(401).json({"error": "You must be logged in!"});

    else if(checkIsSpecificRole(req,'user') || (checkIsSpecificRole(req,'user manager') && req.body.role!=='user')){
      res.status(401).json({"error": "You don't have permission to perform this action!"});
    }
    else{
        const passwordHash = bcrypt.hashSync(req.body.password, 10);
        const user = { name: req.body.name, surname: req.body.surname, email: req.body.email, password: passwordHash, role: req.body.role };
        const usr = await createUser(user);
        res.json(usr);
    }
  }

  async function httpGetUserById(req, res){
    if(!isTokenValid(req)) return res.status(401).json({"error": "You must be logged in!"});

    const user = await getUserById(req.params.user_id);
    if(user===undefined || user===null)
      return res.status(404).json({"error":"user with specified id does not exist"});
    res.json(user);
  }

  async function httpUpdateUserById(req, res){
    if(!isTokenValid(req)) 
      return res.status(401).json({"error": "You must be logged in!"});
    
    const id = req.params.user_id;
    let user = await getUserById(id);

    if(user===null || user===undefined)
      return res.status(404).json({"error":"user with specified id does not exist"});
    
    if( checkIsSpecificRole(req,'user') || (checkIsSpecificRole(req,'user manager') && user.role!=='user')){
      return res.status(401).json({"error": "You don't have permission to perform this action!"});
    }
    else{
      const changes = req.body;

      if(checkIsSpecificRole(req, 'user manager') && (changes.role==='admin' || changes.role==='user manager'))
        return res.status(401).json({"error": "You don't have permission to perform this action!"});
      
      let modifiedInfo = {};

      if(changes.password!==undefined){
          const passwordHash = bcrypt.hashSync(changes.password, 10);
          modifiedInfo.password = passwordHash;
      }
      if(changes.name!==undefined) modifiedInfo.name = changes.name;
      if(changes.surname!==undefined) modifiedInfo.surname = changes.surname;
      if(changes.email!==undefined) modifiedInfo.email = changes.email;
      if(changes.role!==undefined) modifiedInfo.role = changes.role;    
        user = await updateUserById(id, modifiedInfo);
        res.json(user);
    }
  }

  async function httpDeleteUserById(req, res){
    if(!isTokenValid(req)) return res.status(401).json({"error": "You must be logged in!"});
    const id = req.params.user_id;
    const toDelete = await getUserById(id);
    
    if(toDelete===null || toDelete===undefined)
      return res.status(404).json({"error":"user with specified id does not exist"});

    if( checkIsSpecificRole(req, 'user') || ( checkIsSpecificRole(req,'user manager')&& toDelete.role!=='user') ) 
        return res.status(401).json({"error": "You don't have permission to perform this action!"});
    else{
          const deletedUser = await deleteUserById(id).then(res.status(200));
          return res.json(deletedUser);
    }
  }

  async function httpUpdateSettingsById(req, res){
    if(!isTokenValid(req)) return res.status(401).json({"error": "You must be logged in!"});
    const id = req.params.user_id;
    const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
    const currentUser = getTokenData(token).payload;

    if( (checkIsSpecificRole(req, 'user manager') || checkIsSpecificRole(req, 'user') ) && currentUser._id!==id  )
      return res.status(401).json({"error": "You don't have permission to perform this action!"});
    
    const settings = req.body;
    const updatedUser = await updateSettingsById(id, {settings:settings});
    if(updatedUser===null || updatedUser===undefined)
      return res.status(404).json({"error":"user with specified id does not exist"});
      
    return res.json(updatedUser);
    }

  module.exports = {
      httpGetAllUsers,
      httpCreateUser,
      httpGetUserById,
      httpUpdateUserById,
      httpDeleteUserById,
      httpUpdateSettingsById,
  }