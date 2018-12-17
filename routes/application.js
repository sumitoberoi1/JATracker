const express = require("express");
const router = express.Router();
const data = require("../data");
const applicationData = data.application;
const multer = require("multer")
const passPortConfig = require("../config/passportConfig")
const helperMethods = require("../helpers/helperMethod")
const errorValidation = require("../helpers/errorValdation")
let active = {};
const multerConfig = {
    storage: multer.diskStorage({
        destination: function(req, file, next){
          next(null, __dirname + '/../userFiles');
        },
        filename: function(req, file, next){
          
          const ext = file.mimetype.split('/')[1];
          next(null, file.fieldname + '-' + Date.now() + '.'+ext);
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

router.use(passPortConfig.ensureAuthenticated)

router.get("/new",(req,res) => {
    active = {newApplication:true}
    res.render("applications/new",{title:'Create New Application',active})
});

router.get("/future",async (req,res) => {
    active = {futureApplications:true}
    try {
        const applications= await applicationData.getFutureApplications(req.user._id)
        res.render("applications/allApplications",{title:'Track Applications',applications:applications,active})
      } catch (e) {
        
        res.status(500).render("error/404",active)
    }
})

router.get("/edit/:id",async(req,res) => {
    try {
        const id = req.params.id
        active = {newApplication:true}
        const application = await applicationData.getApplicationByID(id,req.user._id)
        res.render("applications/new",{title:'Edit Application',application:application,active})
    } catch (e) {
        active = {allApplications:true}
        res.status(404).render("error/404",active)
    }
});

router.get("/all",async(req,res) => {
    try {
        const applications= await applicationData.getAllApplications(req.user._id);
        res.json({'applications':applications})
      } catch (e) {
        res.status(500).json({
          error: e
      });
    }
});

router.get("/all/future",async(req,res) => {
    try {
        const applications= await applicationData.getFutureApplications(req.user._id);
        res.json({'applications':applications})
      } catch (e) {
        res.status(500).json({
          error: e
      });
    }
});

router.get("/:id",async (req,res) => {
    try {
        const id = req.params.id
        active = {newApplication:true}
        const application = await applicationData.getApplicationByID(id,req.user._id)
        res.render("applications/application",{title:'My Application',application:application,active})
    } catch (e) {
        active = {allApplications:true}
        res.status(404).render("error/404",active)
    }
});

router.delete("/:id",async (req,res) => {
    const id = req.params.id
    try {
        const application = await applicationData.getApplicationByID(id,req.user._id)
        if (application) {
            await applicationData.deleteApplication(id,req.user._id)
            res.status = 201
            res.json({redirect:'/application'})
        }
    } catch (e) {
        active = {allApplications:true}
        res.status(404).render("error/404",active)
    }
})

router.get("/",async (req, res) => {
    try {
      active = {allApplications:true}
      const applications= await applicationData.getAllApplications(req.user._id);
      res.render("applications/allApplications",{title:'All Applications',applications:applications,active})
    } catch (e) {
        active = {allApplications:true}
        res.status(500).render("error/500",active)
    }
});

router.post("/",
multerObject,async (req,res) => {
    const applicationPostData = req.body;
    try {
        if (req.files) {
            if (req.files.resume && req.files.resume.length > 0) {
                const resume = req.files.resume[0]
                applicationPostData.resume = resume
            }
            if (req.files.coverletter && req.files.coverletter.length > 0) {
                const coverletter = req.files.coverletter[0]
                applicationPostData.coverletter = coverletter
            }
        }
        if (!errorValidation.isValidApplicationData(applicationPostData)) {
            req.flash("error","Invalid ApplicationData")
            active = {newApplication:true}
            res.status(422).render("applications/new",{title:'Create New Application',active,errors:req.flash("error")})
            return
        }
        const newApplication = await applicationData.createApplication(applicationPostData,req.user._id);
        res.redirect(`/application/${newApplication._id}`)
        return
     } catch (e) {
        req.flash("error","Server Error")
        res.status(500).render("applications/new",{title:'Create New Application',active,errors:req.flash("error")})
    }
})


router.post("/editApplication",multerObject,async (req, res) => {
    const id = req.body.id
    const application = await applicationData.getApplicationByID(id,req.user._id)
    try {
        const appplicationToSaveData = req.body
        if (req.files) {
            if (req.files.resume && req.files.resume.length > 0) {
                appplicationToSaveData.resume = req.files.resume[0]
            } else if (application.resume) {
                appplicationToSaveData.resume = application.resume
            }
            if (req.files.coverletter && req.files.coverletter.length > 0) {
                appplicationToSaveData.coverletter = req.files.coverletter[0]
            } else if (application.coverletter) {
                appplicationToSaveData.coverletter = application.coverletter
            }
        }
        if (!errorValidation.isValidApplicationData(appplicationToSaveData)) {
            req.flash("error","Invalid ApplicationData")
            active = {newApplication:true}
            res.status(422).render("applications/new",{title:'Create New Application',application:application,active,errors:req.flash("error")})
            return
        }
        const editApplication = await applicationData.editApplication(id,appplicationToSaveData,req.user._id)
        res.redirect(`/application/${editApplication._id}`)
        return
    } catch (e) {
        req.flash("error","Server Error")
        res.status(500).render("applications/new",{title:'Create New Application',application:application,active,errors:req.flash("error")})
    }
})



module.exports = router