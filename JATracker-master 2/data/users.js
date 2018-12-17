const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uuid = require('uuid/v4');
const errorValidator = require('../helpers/errorValdation')


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
      gitHubLink: null,
      linkedinLink: null,
      stackOverflowLink: null,
      workExperience: [],
      projects: []
    },
    resume: null,
    coverLetter: null,
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
  if (errorValidator.dataValidString(id) && errorValidator.isValidProfiletData(InfoToUpdate)) {


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
  if (currUser === null) {
      throw "Fail to update profile!";
  }
  return await this.getUserByID(id);
}
else {
  throw 'Invalid Data';
} 
}



async function addUserProject(id, newProject) {
  const userCollection = await users();
  newProject._id = uuid();
  if (errorValidator.dataValidString(id) && errorValidator.isValidProjectData(newProject)) {
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
else {
  throw 'Invalid Data';
}
}

async function editUserWorkExperience(id, workExperience) {
  if(errorValidator.dataValidString(id)) {
    for (var i = 0; i< workExperience.length; i++) {
      if (!errorValidator.isValidWorkExperienceData(workExperience[i])) {
        throw 'Invalid Data'
      }
    }
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
  else {
    throw 'Invalid Data'
  }
}

async function editUserProject(id, projects) {
  if(errorValidator.dataValidString(id)) {
    for (var i = 0; i< projects.length; i++) {
      console.log("project!!!!!!!", projects[i]);
      if (!errorValidator.isValidProjectData(projects[i])) {
        throw 'Invalid Data'
      }
    }
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
  else {
    throw 'Invalid Data'
  }
}

async function deleteWorkExperience(userId, workExperienceId) {
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

async function deleteProject(userId, projectId) {
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