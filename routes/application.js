const express = require("express");
const router = express.Router();
const data = require("../data");
const applicationData = data.application;
router.get("/new",(req,res) => {
    res.render("applications/new")
});
router.post("/",async (req,res) => {
    const applicationPostData = req.body;
    console.log(`Req body ${JSON.stringify(req.body)}`);
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
        res.json(newApplication);
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