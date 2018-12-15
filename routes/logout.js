const express = require("express");
const router = express.Router();
const passPortConfig = require("../config/passportConfig")
router.get("/",passPortConfig.ensureAuthenticated, (req, res) => {
    req.logOut()
    res.render('logout',{layout:false});
});

module.exports = router;