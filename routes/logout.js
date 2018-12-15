const express = require("express");
const router = express.Router();
<<<<<<< HEAD
const passPortConfig = require("../config/passportConfig")
router.get("/",passPortConfig.ensureAuthenticated, (req, res) => {
    req.logOut()
    res.render('logout');
=======

router.get("/", (req, res) => {
    if (req.session) {
        req.session.destroy(function(err) {
            // cannot access session here
            if(err) {
                return next(err);
            }
            else {
                res.clearCookie('AuthCookie');
                res.render("logout",{layout:false});
            }
         })
    }
>>>>>>> origin/nitish
});

module.exports = router;