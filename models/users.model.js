const bcrypt = require('bcryptjs');
const { findOneAndDelete, findByIdAndDelete } = require('../models/users.mongo');

const usersDatabase = require('../models/users.mongo');

async function registerUser(user) {
    try {
      return await usersDatabase.create(user);
    } catch(err) {
      console.error(`Could not save user ${err}`);
    }
  }

async function logInUser(user){
  let usr = await usersDatabase.findOne({email:user.email},{password:1, email:1, role:1, _id:1} );
  if( bcrypt.compareSync(user.password, usr.password))
  return usr;
    return undefined;
}

  
async function getAllUsers() {
return await usersDatabase
  .find({}, { '_id': 0, '__v': 0, password: 0 });
}

async function createUser(user){
    return await usersDatabase.create(user);
}

async function getUserById(id){
    return await usersDatabase.findById({_id: id}, { _id: 1, name: 1, surname: 1, role: 1 });
}

async function updateUserById(id, modifiedInfo){
return  await usersDatabase.findOneAndUpdate(
        {_id:id},
        modifiedInfo,
        {new:true}
      );
}

async function deleteUserById(id){
      await usersDatabase.findOneAndDelete( {_id:id} );
}

async function updateSettingsById(id, modifiedInfo){
  return await usersDatabase.findOneAndUpdate(
    {_id:id},
    modifiedInfo,
    {new:true}
  )
}

module.exports = {
    registerUser,
    logInUser,
    getAllUsers,
    createUser,
    getUserById,
    updateUserById,
    deleteUserById,
    updateSettingsById,
}