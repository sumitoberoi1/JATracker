const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const uuid = require('uuid/v4');
const multer = require("multer");

const multerConfig = {
    storage: multer.diskStorage({
        destination: function(req, file, next){
          next(null, __dirname + '/../userFiles');
        },
        filename: function(req, file, next){
          console.log('file', file);
          const ext = file.mimetype.split('/')[1];
          next(null, file.fieldname + '-' + Date.now() + '.'+  ext);
        }
      })
}
const multerObject = multer(multerConfig).fields([
    {
    name: 'resume', maxCount: 1
    }, 
    {
    name: 'coverLetter', maxCount: 1
}])

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
        // console.log("auth" + req.cookies.AuthCookie)
        user = await userData.getUserByID(req.cookies.AuthCookie);
        // console.log(user)
      } 
      catch (e) 
      {
          res.render("login", {error: e});
          return;
      }
      if (user) {
        req.session.user = user;
        let profile = user;
        active = {profile:true}
        res.render("user/edit_profile",{title:'Edit Profile', active, profile: profile})
      }
      else {
        res.redirect('/login');
      }
    }
    else {
      let profile = req.session.user;
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
        let profile = user;
        active = {profile:true}
        res.render("user/view_profile", {title:'View Profile', active, profile: profile})
      }
      else {
        res.redirect('/login');
      }
    }
    else {
      let profile = req.session.user;
      console.log(JSON.stringify(profile))
      active = {profile:true}
      res.render("user/view_profile", {title:'View Profile', active, profile: profile})
    }
  }
});

router.post("/edit_profile", multerObject, async (req, res) => {
  let newProfile = {};
  newProfile.fullName = req.body.fullName;
  newProfile.school = req.body.school;
  newProfile.skills = req.body.skills;
  newProfile.presentJob = req.body.presentJob;
  newProfile.workExperience = req.session.user.profile.workExperience;
  newProfile.projects = req.session.user.profile.projects;
  let resume = null
  let coverLetter = null
  if (req.files) {
    if (req.files.resume && req.files.resume.length > 0) {
        console.log(`In resume`, req.files.resume)
        resume = req.files.resume[0]
    }
    if (req.files.coverLetter && req.files.coverLetter.length > 0) {
        console.log(`In coverLetter`, req.files.coverLetter)
        coverLetter = req.files.coverLetter[0]
    }
  }
  console.log('files:', req.files)
  console.log('resume', resume)
  console.log('coverLetter', coverLetter)
  try 
  {
    // console.log("check here" + JSON.stringify(newProfile))
    user = await userData.updateUserProfile(req.session.user._id, newProfile, resume, coverLetter)  
    // console.log("check here" + JSON.stringify(user))
    req.session.user = user;
    // console.log("originalname", req.files.resume[0])
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
  newWorkExperience._id = uuid()
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
    res.redirect('/user/edit_profile');
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
  newProject._id = uuid()
  newProject.name = req.body.name;
  newProject.position = req.body.position;
  newProject.startDate = req.body.projectstartDate;
  newProject.endDate = req.body.projectendDate;
  newProject.description = req.body.projectdescription;
  try 
  {
    console.log("user" + JSON.stringify(req.session.user))
    console.log(JSON.stringify(newProject))
    user = await userData.addUserProject(req.session.user._id, newProject);
    req.session.user = user;
    res.redirect('/user/edit_profile');
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


// router.post("/profile/work_experience/edit/:id", async (req, res) => {
//   let updatedWorkExperience = {};
//   updatedWorkExperience._id = req.params.id;
//   updatedWorkExperience.jobTittle = req.body.jobTittle;
//   updatedWorkExperience.employer = req.body.employer;
//   updatedWorkExperience.startDate = req.body.startDate;
//   updatedWorkExperience.endDate = req.body.endDate;
//   updatedWorkExperience.location = req.body.location;
//   updatedWorkExperience.description = req.body.description;
//   try 
//   {
//     let workExperience = req.session.user.profile.workExperience;
//     for(var i=0; i < workExperience.length; i++){
//       if(workExperience[i]._id === req.params.id) {
//         workExperience[i] = updatedWorkExperience;
//       }
//     }
//     console.log(JSON.stringify(workExperience))
//     user = await userData.editUserWorkExperience(req.session.user._id, workExperience);
//     req.session.user = user;
//     res.redirect('/user/edit_profile');
//   } 
//   catch (e) 
//   {
//     console.log(e)
//     res.status(500).json({ error: e });
//     return;
//   }
// });


router.post("/profile/project/edit/:id", async (req, res) => {
  let updatedProject = {};
  updatedProject._id = req.params.id;
  updatedProject.name = req.body.name;
  updatedProject.position = req.body.position;
  updatedProject.startDate = req.body.projectstartDate;
  updatedProject.endDate = req.body.projectendDate;
  updatedProject.description = req.body.projectdescription;
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
    res.redirect('/user/edit_profile');
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
    res.redirect('/user/edit_profile');
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
    res.redirect('/user/edit_profile');
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
    res.redirect('/user/edit_profile');
  } 
  catch (e) 
  {
    console.log(e)
    res.status(500).json({ error: e });
    return;
  }
});

module.exports = router;
