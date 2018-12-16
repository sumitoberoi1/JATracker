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
          console.log(file);
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
    try {
        active = {futureApplications:true}
        const applications= await applicationData.getFutureApplications(req.user._id)
        res.render("applications/allApplications",{title:'Track Applications',applications:applications,active})
      } catch (e) {
      console.log(`Error ${e}`)
        res.status(500).json({
          error: e
        });
    }
})

router.get("/edit/:id",async(req,res) => {
    const id = req.params.id
    active = {newApplication:true}
    const application = await applicationData.getApplicationByID(id,req.user._id)
    res.render("applications/new",{title:'Edit Application',application:application,active})
});

router.get("/all",async(req,res) => {
    try {
        const applications= await applicationData.getAllApplications(req.user._id);
        res.json({'applications':applications})
      } catch (e) {
      console.log(`Error ${e}`)
        res.status(500).json({
          error: e
      });
    }
});

router.get("/:id",async (req,res) => {
    const id = req.params.id
    active = {newApplication:true}
    const application = await applicationData.getApplicationByID(id,req.user._id)
    res.render("applications/application",{title:'My Application',application:application,active})
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
        console.log(`Error in deleting application ${e}`)
        res.status(500).json({error: e});
    }
})

router.get("/",async (req, res) => {
    try {
      active = {allApplications:true}
      const applications= await applicationData.getAllApplications(req.user._id);
      res.render("applications/allApplications",{title:'All Applications',applications:applications,active})
    } catch (e) {
    console.log(`Error ${e}`)
      res.status(500).json({
        error: e
      });
    }
});

router.post("/",
multerObject,async (req,res) => {
    const applicationPostData = req.body;
    const {
        companyName,
        role,
        applyDate,
        applicationStatus,
        jobSource,
        notes
    } = applicationPostData;
    try {
     const appplicationToSaveData = {companyName,role,applyDate,applicationStatus,jobSource,notes}
        if (req.files) {
            if (req.files.resume && req.files.resume.length > 0) {
                console.log(`In resume ${req.files.resume}`)
                const resume = req.files.resume[0]
                appplicationToSaveData.resume = resume
            }
            if (req.files.coverletter && req.files.coverletter.length > 0) {
                const coverletter = req.files.coverletter[0]
                appplicationToSaveData.coverletter = coverletter
            }
        }
        if (!errorValidation.isValidApplicationData(applicationPostData)) {
            req.flash("error","Invalid ApplicationData")
            active = {newApplication:true}
            res.status(422).render("applications/new",{title:'Create New Application',active,errors:req.flash("error")})
            return
        }
        const newApplication = await applicationData.createApplication(appplicationToSaveData,req.user._id);
        console.log(`Application Data ${JSON.stringify(newApplication)}`)
        res.redirect(`/application/${newApplication._id}`)
        return
     } catch (e) {
         console.log(`Error in creating application ${e}`)
        res.status(500).json({error: e});
    }
})


router.put("/application/:id",async (req,res) => {
   
})

router.post("/editApplication",multerObject,async (req, res) => {
    const id = req.body.id
    const application = await applicationData.getApplicationByID(id,req.user._id)
    console.log(`Here in applicatioonnEDIt`)
    try {
        const appplicationToSaveData = req.body
        const {
            companyName,
            role,
            applyDate,
            applicationStatus,
            jobSource,
            notes
        } = appplicationToSaveData;
        const appplicationToSaveData = {companyName,role,applyDate,applicationStatus,jobSource,notes}
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
        const editApplication = await applicationData.editApplication(id,appplicationToSaveData,req.user._id)
        res.redirect(`/application/${editApplication._id}`)
        return
    } catch (e) {
        res.status(404).json({error: e});
    }
})



module.exports = router