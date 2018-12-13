const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const uuid = require('uuid/v4');

router.get("/edit_profile", async (req, res) => {
  if(!req.cookies.AuthCookie){
    res.clearCookie("AuthCookie");
    res.redirect('/login');
    return;
  }
  else {
    if (!req.session.user) {
      let user = null;
      try 
      {
        console.log("auth" + req.cookies.AuthCookie)
        user = await userData.getUserByID(req.cookies.AuthCookie);
        console.log(user)
      } 
      catch (e) 
      {
          res.render("login", {error: e});
          return;
      }
      req.session.user = user;
    }
    active = {profile:true}
    let profile = req.session.user.profile;
    res.render("user/edit_profile",{title:'Edit Profile', active, profile: profile})
  }
});

router.get("/view_profile", async (req, res) => {
  if(!req.cookies.AuthCookie){
    res.redirect('/login');
    return;
  }
  else {
    if (!req.session.user) {
      let user = null;
      try 
      {
        user = await userData.getUserByID(req.cookies.AuthCookie);
        console.log(user)
      } 
      catch (e) 
      {
          res.render("login", {error: e});
          return;
      }
      req.session.user = user;
    }

    active = {profile:true}
    let profile = req.session.user.profile;
    res.render("user/view_profile", {title:'View Profile', active, profile: profile})
  }
});

router.get("/work_experience", async (req, res) => {
  if(!req.cookies.AuthCookie){
    res.redirect('/login');
    return;
  }
  else {
    if (!req.session.user) {
      let user = null;
      try 
      {
        user = await userData.getUserByID(req.cookies.AuthCookie);
        console.log(user)
      } 
      catch (e) 
      {
          res.render("login", {error: e});
          return;
      }
      req.session.user = user;
    }
    res.render("user/work_experience", {title:'Work Experience'})
  }
});

router.get("/project", async (req, res) => {
  if(!req.cookies.AuthCookie){
    res.redirect('/login');
    return;
  }
  else {
    if (!req.session.user) {
      let user = null;
      try 
      {
        user = await userData.getUserByID(req.cookies.AuthCookie);
        console.log(user)
      } 
      catch (e) 
      {
          res.render("login", {error: e});
          return;
      }
      req.session.user = user;
    }
    res.render("user/project", {title:'Work Experience'})
  }
});

router.post("/edit_profile", async (req, res) => {
  let InfoToUpdate = {};
  InfoToUpdate.fullName = req.body.fullName;
  InfoToUpdate.school = req.body.school;
  InfoToUpdate.skills = req.body.skills;
  InfoToUpdate.presentJob = req.body.presentJob;
  InfoToUpdate.resume = req.body.resume;
  InfoToUpdate.coverLetter = req.body.coverLetter;

  try 
  {
    // console.log('user:', InfoToUpdate)
    user = await userData.updateUser(req.session.user._id, InfoToUpdate);
    // console.log("check here" + JSON.stringify(user))
    req.session.user = user;
    res.redirect('/user/view_profile');
  } 
  catch (e) 
  {
    res.status(500).render("error/404", {e});
    return;
  }
  
});

router.post("/work_experience", async (req, res) => {
  let newWorkexperience = {}
  newWorkexperience.workID = uuid()
  newWorkexperience.jobTittle = req.body.jobTittle;
  newWorkexperience.employer = req.body.employer;
  newWorkexperience.startDate = req.body.startDate;
  newWorkexperience.endDate = req.body.endDate;
  newWorkexperience.location = req.body.location;
  newWorkexperience.description = req.body.description;
  // console.log('newWorkexperience:', newWorkexperience)

  try
  {
    user = await userData.addWorkexperience(req.session.user._id, newWorkexperience);
    console.log('id:', req.session.user._id)
    req.session.user = user
    res.redirect('/user/edit_profile');
  }
  catch (e) 
  {
    res.status(500).render("error/404", {e});
    return;
  }
});

router.post("/project", async (req, res) => {
  let newProject = {}
  newProject.projectID = uuid()
  newProject.name = req.body.name;
  newProject.position = req.body.position;
  newProject.startDate = req.body.startDate;
  newProject.endDate = req.body.endDate;
  newProject.description = req.body.description;
  // console.log('newWorkexperience:', newWorkexperience)

  try
  {
    user = await userData.addProject(req.session.user._id, newProject);
    console.log('id:', req.session.user._id)
    req.session.user = user
    res.redirect('/user/edit_profile');
  }
  catch (e) 
  {
    res.status(500).render("error/404", {e});
    return;
  }
});

module.exports = router;
