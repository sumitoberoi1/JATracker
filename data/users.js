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
    if (!user) {
      throw "Invalid AuthCookie"
    }
    return user;
  } 
  catch (e) {
  throw e;
  }
}



async function getUserByID(_id) 
{
  try 
  {
    if (!_id || typeof _id != 'string') {
        throw "id not vaild";
    }
    let userCollection = await users();
    let user = await userCollection.findOne({_id: _id});
    if (!user) {
      throw "Invalid AuthCookie"
    }
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

async function getUserByEmail(email) 
{
  try 
  {
    if (!email || typeof email != 'string') {
        throw "email not vaild";
    }
    let userCollection = await users();
    let user = await userCollection.findOne({email: email});
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
    }
  };
  const createdNewUser = await userCollection.insertOne(newUser);
  if (createdNewUser.insertedCount === 0) throw "Fail to create new user!";
  return createdNewUser;
}


async function addUserWorkExperience(id, newWorkExperience) {
  try {
    const userCollection = await users();
    newWorkExperience._id = uuid();
    const currUser = await userCollection.findOneAndUpdate(
                    { "_id" : id},
                    { $push: 
                      {"profile.workExperience": newWorkExperience}
                    },
                    {
                      safe: true,
                      upsert: true
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

async function updateUserProfile(id, InfoToUpdate, resume, coverLetter) {
  try {
    console.log('resume', resume)
    console.log('coverLetter', coverLetter)
    console.log(JSON.stringify(InfoToUpdate))
    const userCollection = await users();
    const currUser = await userCollection.findOneAndUpdate(
                    { "_id" :  id},
                    { $set: 
                      {
                        "profile" : InfoToUpdate,
                        "resume": resume,
                        "coverLetter": coverLetter
                      }
                    }
                );
                console.log('curr:', currUser)
    if (currUser === null) {
        throw "Fail to update profile!";
    }
    return await this.getUserByID(id);
  }
  catch(error) {
      throw error;
  }
}


async function addUserProject(id, newProject) {
  try {
    const userCollection = await users();
    newProject._id = uuid();
    const currUser = await userCollection.findOneAndUpdate(
                    { "_id" : id},
                    { $push: 
                      {"profile.projects": newProject}
                    },
                    {
                      safe: true,
                      upsert: true
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

async function editUserWorkExperience(id, workExperience) {
  try {
    const userCollection = await users();
    const currUser = await userCollection.findOneAndUpdate(
                    { "_id" :  id},
                    { $set: 
                      { "profile.workExperience" : workExperience}
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

async function editUserProject(id, projects) {
  try {
    const userCollection = await users();
    const currUser = await userCollection.findOneAndUpdate(
                    { "_id" :  id},
                    { $set: 
                      { "profile.projects" : projects}
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


async function deleteWorkExperience(userId, workExperienceId) {
  try {
    const userCollection = await users();
    const currUser = await userCollection.findOneAndUpdate(
                    { "_id" : userId},
                    { $pull: 
                      {"profile.workExperience": {"_id": workExperienceId}}
                    }
    );
    if (currUser === null) {
        throw "Fail to delete profile!";
    }
    return await this.getUserByID(userId);
  }
  catch(error) {
      throw error;
  }
}

async function deleteProject(userId, projectId) {
  try {
    const userCollection = await users();
    const currUser = await userCollection.findOneAndUpdate(
                    { "_id" : userId},
                    { $pull: 
                      {"profile.projects": {"_id": projectId}}
                    }
    );
    if (currUser === null) {
        throw "Fail to delete profile!";
    }
    return await this.getUserByID(userId);
  }
  catch(error) {
      throw error;
  }
}

module.exports = {
  getUserByUsername,
  getUserByID,
  signUp,
  updateUserProfile,
  addUserWorkExperience,
  addUserProject,
  editUserWorkExperience,
  editUserProject,
  deleteWorkExperience,
  deleteProject,
  getUserByEmail
};