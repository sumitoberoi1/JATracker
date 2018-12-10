const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuid = require('uuid/v4');


async function getUserByUsername(username) 
{
  try 
  {
    if (!username || typeof username != 'string') {
        throw "username not vaild";
    }
    let userCollection = await users();
    let user = await userCollection.findOne({username: username});
    return user;
  } 
  catch (e) {
  throw e;
  }
}


async function signUp(username, password, email) 
{
  let hashedPassword = await bcrypt.hash(password, saltRounds);
	let userCollection = await users();
  let newUser = 
  {
    _id: uuid(),
    username: username,
    hashedPassword: hashedPassword,
    email: email
  };
  console.log("new user:" + newUser)
  const createdNewUser = await userCollection.insertOne(newUser);
  if (createdNewUser.insertedCount === 0) throw "Fail to create new user!";
  return createdNewUser;
}


module.exports = {
	getUserByUsername,
  signUp,
};