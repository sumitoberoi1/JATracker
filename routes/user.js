const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const passPortConfig = require("../config/passportConfig")
const multer = require("multer");
const uuid = require('uuid/v4');
router.use(passPortConfig.ensureAuthenticated)

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
  name: 'coverletter', maxCount: 1
}])

router.get("/edit_profile", async (req, res) => {
  const profile = req.user;
  const active = {profile:true}
  res.render("user/edit_profile",{title:'Edit Profile', active, profile: profile})
});


router.get("/view_profile", async (req, res) => {
  const profile = req.user;
  const active = {profile:true}
  res.render("user/view_profile", {title:'View Profile', active, profile: profile})
});

router.get("/profile/work_experience/edit/:id", async (req, res) => {
  const user = req.user
  const profile = user.profile;
  const workExperiences = profile.workExperience;
  let currWorkExperience;
  for(var i=0; i < workExperiences.length; i++){
    if(workExperiences[i]._id === req.params.id) {
      currWorkExperience = workExperiences[i];
    }
  }
  res.render("user/edit_work_experience", {workExperience : currWorkExperience});
});

router.get("/profile/project/edit/:id", async (req, res) => {
  const user = req.user
  const profile = user.profile;
  const userprojects = profile.projects;
  for(var i=0; i < userprojects.length; i++){
    if(userprojects[i]._id === req.params.id) {
      currProject = userprojects[i];
    }
  }
  res.render("user/edit_project", {project : currProject});
});

router.get("/profile/work_experience/delete/:id", async (req, res) => {
  try 
  {
    user = await userData.deleteWorkExperience(req.user._id, req.params.id);
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

router.post("/edit_profile", multerObject, async (req, res) => {
  console.log(`Here in edit profile`)
  let newProfile = {};
  const userdata = req.user
  newProfile.fullName = req.body.fullName;
  newProfile.school = req.body.school;
  newProfile.skills = req.body.skills;
  newProfile.presentJob = req.body.presentJob;
  newProfile.workExperience = userdata.profile.workExperience;
  newProfile.projects = userdata.profile.projects;
  let resume = null
  let coverLetter = null
  if (req.files) {
    if (req.files.resume && req.files.resume.length > 0) {
        console.log(`In resume`)
        resume = req.files.resume[0]
    }
    else if (userdata.resume) {
      resume = userdata.resume
    }
    if (req.files.coverletter && req.files.coverletter.length > 0) {
        console.log(`In coverLetter`)
        coverLetter = req.files.coverletter[0]
    }
    else if (userdata.coverLetter) {
      coverLetter = userdata.coverLetter
    }
  }
  try 
  {
    user = await userData.updateUserProfile(req.user._id, newProfile, resume, coverLetter)  
    console.log(user)
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
  newWorkExperience._id = uuid()
  newWorkExperience.jobTittle = req.body.jobTittle;
  newWorkExperience.employer = req.body.employer;
  newWorkExperience.startDate = req.body.startDate;
  newWorkExperience.endDate = req.body.endDate;
  newWorkExperience.location = req.body.location;
  newWorkExperience.description = req.body.description;
  try 
  {
    console.log("user" + JSON.stringify(req.user))
    console.log(JSON.stringify(newWorkExperience))
    user = await userData.addUserWorkExperience(req.user._id, newWorkExperience);
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
    console.log("user" + JSON.stringify(req.user))
    console.log(JSON.stringify(newProject))
    user = await userData.addUserProject(req.user._id, newProject);
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
    const userdata = req.user
    let workExperience = userdata.profile.workExperience;
    for(var i=0; i < workExperience.length; i++){
      if(workExperience[i]._id === req.params.id) {
        workExperience[i] = updatedWorkExperience;
      }
    }
    console.log(JSON.stringify(workExperience))
    curruser = await userData.editUserWorkExperience(req.user._id, workExperience);
    req.session.user = curruser;
    res.redirect('/user/edit_profile');
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
  updatedProject.startDate = req.body.projectstartDate;
  updatedProject.endDate = req.body.projectendDate;
  updatedProject.description = req.body.projectdescription;
  try 
  {
    const userdata = req.user
    let projects = userdata.profile.projects;
    for(var i=0; i < projects.length; i++){
      if(projects[i]._id === req.params.id) {
        projects[i] = updatedProject;
      }
    }
    curruser = await userData.editUserProject(req.user._id, projects);
    req.session.user = curruser;
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
