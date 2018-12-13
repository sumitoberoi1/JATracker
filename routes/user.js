const express = require("express");
const router = express.Router();
const userData = require("../data/users");

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
      if (user) {
        req.session.user = user;
        let profile = user.profile;
        active = {profile:true}
        res.render("user/edit_profile",{title:'Edit Profile', active, profile: profile})
      }
      else {
        res.redirect('/login');
      }
    }
    else {
      let profile = req.session.user.profile;
      active = {profile:true}
      res.render("user/edit_profile", {title:'Edit Profile', active, profile: profile})
    }
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
      } 
      catch (e) 
      {
        res.redirect('/login');
        return;
      }
      if (user) {
        req.session.user = user;
        let profile = user.profile;
        active = {profile:true}
        res.render("user/view_profile", {title:'View Profile', active, profile: profile})
      }
      else {
        res.redirect('/login');
      }
    }
    else {
      let profile = req.session.user.profile;
      console.log(JSON.stringify(profile))
      active = {profile:true}
      res.render("user/view_profile", {title:'View Profile', active, profile: profile})
    }
  }
});

router.post("/edit_profile", async (req, res) => {
  let newProfile = {};
  newProfile.fullName = req.body.fullName;
  newProfile.school = req.body.school;
  newProfile.skills = req.body.skills;
  newProfile.presentJob = req.body.presentJob;
  newProfile.resume = req.body.resume;
  newProfile.coverLetter = req.body.coverLetter;
  newProfile.workExperience = req.session.user.profile.workExperience;
  newProfile.projects = req.session.user.profile.projects;

  try 
  {
    console.log("check here" + JSON.stringify(newProfile))
    user = await userData.updateUserProfile(req.session.user._id, newProfile);
    console.log("check here" + JSON.stringify(user))
    req.session.user = user;
    res.redirect('/user/view_profile');
  } 
  catch (e) 
  {
    res.status(500).render("error/404", {e});
    return;
  }
  
});

router.post("/profile/new_work_experience", async (req, res) => {
  let newWorkExperience = {};
  newWorkExperience.jobTittle = req.body.jobTittle;
  newWorkExperience.employer = req.body.employer;
  newWorkExperience.startDate = req.body.startDate;
  newWorkExperience.endDate = req.body.endDate;
  newWorkExperience.location = req.body.location;
  newWorkExperience.description = req.body.description;

  try 
  {
    console.log("user" + JSON.stringify(req.session.user))
    console.log(JSON.stringify(newWorkExperience))
    user = await userData.addUserWorkExperience(req.session.user._id, newWorkExperience);
    req.session.user = user;
    res.redirect('/user/view_profile');
  } 
  catch (e) 
  {
    console.log(e)
    res.status(500).json({ error: e });
    return;
  }
});

router.post("/profile/new_project", async (req, res) => {
  let newProject = {};
  newProject.name = req.body.name;
  newProject.position = req.body.position;
  newProject.startDate = req.body.startDate;
  newProject.endDate = req.body.endDate;
  newProject.description = req.body.description;
  try 
  {
    console.log("user" + JSON.stringify(req.session.user))
    console.log(JSON.stringify(newProject))
    user = await userData.addUserProject(req.session.user._id, newProject);
    req.session.user = user;
    res.redirect('/user/view_profile');
  } 
  catch (e) 
  {
    console.log(e)
    res.status(500).json({ error: e });
    return;
  }
});

router.get("/profile/work_experience/edit/:id", async (req, res) => {
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
      } 
      catch (e) 
      {
        res.redirect('/login');
        return;
      }
      if (user) {
        req.session.user = user;
        let currWorkExperience = null;
        let workExperience = user.profile.workExperience;

        for(var i=0; i < workExperience.length; i++){
          if(workExperience[i]._id === req.params.id) {
            currWorkExperience = workExperience[i];
          }
        }
        res.render("user/edit_work_experience", {currWorkExperience : currWorkExperience});
      }
      else {
        res.redirect('/login');
      }
    }
    else {
      let currWorkExperience = null;
      let workExperience = req.session.user.profile.workExperience;

      for(var i=0; i < workExperience.length; i++){
        if(workExperience[i]._id === req.params.id) {
          currWorkExperience = workExperience[i];
        }
      }
      console.log(JSON.stringify(currWorkExperience))
      res.render("user/edit_work_experience", {workExperience : currWorkExperience});
    }
  }
});



router.get("/profile/project/edit/:id", async (req, res) => {
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
      } 
      catch (e) 
      {
        res.redirect('/login');
        return;
      }
      if (user) {
        req.session.user = user;
        let currProject = null;
        let projects = user.profile.projects;

        for(var i=0; i < projects.length; i++){
          if(projects[i]._id === req.params.id) {
            currProject = projects[i];
          }
        }
        console.log("getCUrrProject!!!!!!!!!!!!!!!!!" + JSON.stringify(currProject));
        res.render("user/edit_project", {project : currProject});
      }
      else {
        res.redirect('/login');
      }
    }
    else {
      let currProject = null;
      let projects = req.session.user.profile.projects;

      for(var i=0; i < projects.length; i++){
        if(projects[i]._id === req.params.id) {
          currProject = projects[i];
        }
      }
      res.render("user/edit_project", {project : currProject});
    }
  }
});


router.post("/profile/work_experience/edit/:id", async (req, res) => {
  let updatedWorkExperience = {};
  updatedWorkExperience._id = req.params.id;
  updatedWorkExperience.jobTittle = req.body.jobTittle;
  updatedWorkExperience.employer = req.body.employer;
  updatedWorkExperience.startDate = req.body.startDate;
  updatedWorkExperience.endDate = req.body.endDate;
  updatedWorkExperience.location = req.body.location;
  updatedWorkExperience.description = req.body.description;
  try 
  {
    let workExperience = req.session.user.profile.workExperience;
    for(var i=0; i < workExperience.length; i++){
      if(workExperience[i]._id === req.params.id) {
        workExperience[i] = updatedWorkExperience;
      }
    }
    console.log(JSON.stringify(workExperience))
    user = await userData.editUserWorkExperience(req.session.user._id, workExperience);
    req.session.user = user;
    res.redirect('/user/view_profile');
  } 
  catch (e) 
  {
    console.log(e)
    res.status(500).json({ error: e });
    return;
  }
});


router.post("/profile/project/edit/:id", async (req, res) => {
  let updatedProject = {};
  updatedProject._id = req.params.id;
  updatedProject.name = req.body.name;
  updatedProject.position = req.body.position;
  updatedProject.startDate = req.body.startDate;
  updatedProject.endDate = req.body.endDate;
  updatedProject.description = req.body.description;
  try 
  {
    let projects = req.session.user.profile.projects;
    for(var i=0; i < projects.length; i++){
      if(projects[i]._id === req.params.id) {
        projects[i] = updatedProject;
      }
    }
    user = await userData.editUserProject(req.session.user._id, projects);
    req.session.user = user;
    res.redirect('/user/view_profile');
  } 
  catch (e) 
  {
    console.log(e)
    res.status(500).json({ error: e });
    return;
  }
});


router.get("/profile/work_experience/delete/:id", async (req, res) => {
  try 
  {
    user = await userData.deleteWorkExperience(req.session.user._id, req.params.id);
    req.session.user = user;
    res.redirect('/user/view_profile');
  } 
  catch (e) 
  {
    console.log(e)
    res.status(500).json({ error: e });
    return;
  }
});

router.post("/profile/work_experience/edit/:id", async (req, res) => {
  let updatedWorkExperience = {};
  updatedWorkExperience._id = req.params.id;
  updatedWorkExperience.jobTittle = req.body.jobTittle;
  updatedWorkExperience.employer = req.body.employer;
  updatedWorkExperience.startDate = req.body.startDate;
  updatedWorkExperience.endDate = req.body.endDate;
  updatedWorkExperience.location = req.body.location;
  updatedWorkExperience.description = req.body.description;
  try 
  {
    let workExperience = req.session.user.profile.workExperience;
    for(var i=0; i < workExperience.length; i++){
      if(workExperience[i]._id === req.params.id) {
        workExperience[i] = updatedWorkExperience;
      }
    }
    console.log(JSON.stringify(workExperience))
    user = await userData.editUserWorkExperience(req.session.user._id, workExperience);
    req.session.user = user;
    res.redirect('/user/view_profile');
  } 
  catch (e) 
  {
    console.log(e)
    res.status(500).json({ error: e });
    return;
  }
});

router.get("/profile/project/delete/:id", async (req, res) => {
  try 
  {
    user = await userData.deleteProject(req.session.user._id, req.params.id);
    req.session.user = user;
    res.redirect('/user/view_profile');
  } 
  catch (e) 
  {
    console.log(e)
    res.status(500).json({ error: e });
    return;
  }
});





module.exports = router;
