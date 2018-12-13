const express = require("express");
const router = express.Router();
const data = require("../data");
const applicationData = data.application;
const multer = require("multer")
const path = require("path")
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

router.get("/new",(req,res) => {
    active = {newApplication:true}
    res.render("applications/new",{title:'Create New Application',active})
});

router.get("/edit/:id",async(req,res) => {
    const id = req.params.id
    const application = await applicationData.getApplicationByID(id)

    res.render("applications/new",{title:'Edit Application',application:application})
});

router.get("/:id",async (req,res) => {
    const id = req.params.id
    const application = await applicationData.getApplicationByID(id)
    res.render("applications/application",{title:'My Application',application:application})
});


router.get("/", async (req, res) => {
    try {
      const applications= await applicationData.getAllApplications();
      res.render("applications/allApplications",{title:'All Applications',applications:applications})
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
        // let errorMessage = ``;
        // if (!errorChecking.dataValidString(title)) {
        // errorMessage = `Invalid Title`
        // } else if (!errorChecking.arrayContainsObjectsWithKeys(ingredients, ['name', 'amount'])) {
        // errorMessage = `Invalid Ingredients array either you didn't provide an array or one of your ingredient doesn't have a valid structure`
        // } else if (!errorChecking.dataValidArray(steps)) {
        // errorMessage = `Invalid Steps`
        // } else {
        const appplicationToSaveData = {companyName,role,applyDate,applicationStatus,jobSource,notes}
        if (req.files) {
            if (req.files.resume && req.files.resume.length > 0) {
                console.log(`In resume`)
                appplicationToSaveData.resume = req.files.resume[0]
            }
            if (req.files.coverletter && req.files.coverletter.length > 0) {
                console.log(`In coverletter`)
                appplicationToSaveData.coverletter = req.files.coverletter[0]
            }
        }
        console.log(`Application Data ${JSON.stringify(appplicationToSaveData)}`)
        const newApplication = await applicationData.createApplication(appplicationToSaveData);
        res.redirect(`/application/${newApplication._id}`)
        return
        // res.status(500).json({
        // error: errorMessage
        // });
     } catch (e) {
         console.log(`Error in creating application ${e}`)
        res.status(500).json({error: e});
    }
})


router.put("/:id",multerObject,async (req, res) => {
    const id = req.params.id
    try {
        const applicationEditData = req.body
        const {
            companyName,
            role,
            applyDate,
            applicationStatus,
            jobSource,
            notes
        } = applicationEditData;
        const appplicationToSaveData = {companyName,role,applyDate,applicationStatus,jobSource,notes}
        if (req.files) {
            if (req.files.resume && req.files.resume.length > 0) {
                appplicationToSaveData.resume = req.files.resume[0]
            }
            if (req.files.coverletter && req.files.coverletter.length > 0) {
                appplicationToSaveData.coverletter = req.files.coverletter[0]
            }
        }
        const editApplication = await applicationData.editApplication(id,appplicationToSaveData)
        res.redirect(`/application/${editApplication._id}`)
        return
    } catch (e) {
        res.status(404).json({error: e});
    }
})



module.exports = router