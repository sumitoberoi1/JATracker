const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    if (req.session) {
        req.session.destroy(function(err) {
            // cannot access session here
            if(err) {
                return next(err);
            }
            else {
                res.clearCookie('AuthCookie');
                res.render("login");
            }
         })
    }
});

module.exports = router;