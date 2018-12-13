const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuid = require('uuid/v4');



async function getUserByID(_id) 
{
  try 
  {
    if (!_id || typeof _id != 'string') {
        throw "id not vaild";
    }
    let userCollection = await users();
    let user = await userCollection.findOne({_id: _id});
    return user;
  } 
  catch (e) {
  throw e;
  }
}


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
    email: email,
    profile: {
      fullName: null,
      school: null,
      skills: null,
      presentJob: null,
      resume: null,
      coverLetter: null,
      workExperience: [],
      projects: []
    },
  };
  console.log("new user:" + newUser)
  const createdNewUser = await userCollection.insertOne(newUser);
  if (createdNewUser.insertedCount === 0) throw "Fail to create new user!";
  return createdNewUser;
}

async function updateUser(id, InfoToUpdate) {
  try {
    const userCollection = await users();
    currUser = userCollection.findOneAndUpdate(
                    { "_id" :  id},
                    { $set: 
                      { "profile" : InfoToUpdate}
                    }
                );
    if (currUser === null) {
        throw "Fail to update profile!";
    }
    return await this.getUserByID(id);
  }
  catch(error) {
      throw error;
  }
}

async function removeWorkExperience(id, workid)
{
  const user = await this.getUserByID(id)
  const newWorkEXperience = user.profile.workExperience
  console.log(newWorkEXperience.length)
  for(var i=0;i<newWorkEXperience.length;i++){
    if(newWorkEXperience[i].workID === workid)
    newWorkEXperience.split(i, 1)
  }
  try {
    const userCollection = await users();
    currUser = userCollection.findOneAndUpdate(
      { "_id" :  id},
      { $set: 
        { "profile" : newWorkEXperience}
      }
  );
    if (currUser === null) {
        throw "Fail to update profile!";
    }
    return await this.getUserByID(id);
  }
  catch(error) {
      throw error;
  }
}

async function removeProject(id, projectid)
{
  const user = await this.getUserByID(id)
  const newProject = user.profile.projects
  console.log(newProject.length)
  for(var i=0;i<newProject.length;i++){
    if(newProject[i].projectID === projectid)
    newProject.split(i, 1)
  }
  try {
    const userCollection = await users();
    currUser = userCollection.findOneAndUpdate(
      { "_id" :  id},
      { $set: 
        { "profile" : newProject}
      }
  );
    if (currUser === null) {
        throw "Fail to update profile!";
    }
    return await this.getUserByID(id);
  }
  catch(error) {
      throw error;
  }
}

async function addWorkexperience(id, newWorkExperience) 
{
  const user = await this.getUserByID(id)
  const newworkExperience = user.profile
  newworkExperience.workExperience.push(newWorkExperience)
  const ne = user.profile.workExperience
  console.log(ne.length)
  for(var i=0;i<ne.length;i++){
    if(ne[i].workID === workid)
    ne.split(i, 1)
  }
  try {
    const userCollection = await users();
    currUser = userCollection.findOneAndUpdate(
      { "_id" :  id},
      { $set: 
        { "profile" : newworkExperience}
      }
  );
    if (currUser === null) {
        throw "Fail to update profile!";
    }
    return await this.getUserByID(id);
  }
  catch(error) {
      throw error;
  }
}

async function addProject(id, newProject) 
{
  const user = await this.getUserByID(id)
  const project = user.profile
  project.projects.push(newProject)
  try {
    const userCollection = await users();
    currUser = userCollection.findOneAndUpdate(
      { "_id" :  id},
      { $set: 
        { "profile" : project}
      }
  );
    if (currUser === null) {
        throw "Fail to update profile!";
    }
    return await this.getUserByID(id);
  }
  catch(error) {
      throw error;
  }
}

module.exports = {
  getUserByUsername,
  getUserByID,
  signUp,
  updateUser,
  addProject,
  addWorkexperience,
  removeProject,
  removeWorkExperience
};