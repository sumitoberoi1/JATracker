const express = require("express");
const router = express.Router();
const data = require("../data");
const applicationData = data.posts;
router.get("/new",(req,res) => {
    res.render("applications/new")
});
router.post("/",async (req,res) => {
    
    console.log(`Req Body for application Create ${JSON.stringify(req.body)}`);
    
})
module.exports = router