const express = require("express");
const router = express.Router();
const data = require("../data");
const applicationData = data.application;
let active = {};

router.get("/new",(req,res) => {
    active = {newApplication:true}
    res.render("applications/new",{title:'Create New Application',active})
});

router.get("/edit/:id",(req,res) => {
    // const id = req.params.id
    // const application = await applicationData.getApplicationByID(id)
    // res.render("applications/new",{title:'Edit Application',application:})
});

router.get("/:id",async (req,res) => {
    const id = req.params.id
    const application = await applicationData.getApplicationByID(id)
    console.log(`Application ${JSON.stringify(application)}`)
    res.render("applications/application",{title:'My Application',application:application})
});


router.get("/", async (req, res) => {
    try {
      const applicatons= await applicationData.getAllApplications();
      res.render("applications/allApplications",{title:'All Applications',applications:applicatons})
    } catch (e) {
        console.log(`Error ${e}`)
      res.status(500).json({
        error: e
      });
    }
  });


router.post("/",async (req,res) => {
    const applicationPostData = req.body;
    const {
        companyName,
        role,
        applyDate,
        applicationStatus,
        jobSource,
        resume,
        coverletter,
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
        const newApplication = await applicationData.createApplication(applicationPostData);
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


module.exports = router