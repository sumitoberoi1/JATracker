const express = require("express");
const userData = require("../data/users");
const bcrypt = require('bcrypt');
const router = express.Router();

router.get("/", async (req, res) => {
    if (req.cookies.AuthCookie) {
        if (!req.session.user) {
            let user = null;
            try 
            {
                user = await userData.getUserByID(req.cookies.AuthCookie);
            } 
            catch (e) 
            {
                res.render("login", {layout:false,error: e});
                return;
            }
            req.session.user = user;
        }
        res.redirect('/user/edit_profile');
    }
    else {
        res.render('login',{layout:false});
    }
});

router.post("/", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    let user = undefined;
    try 
    {
		user = await userData.getUserByUsername(username);
    } 
    catch (e) 
    {
        res.render("login", {error: e, layout:false});
        return;
	}
    if (!user) {
        res.render("login", {layout:false, error: "Username is not valid"});
        return;
    }
    const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
    if (passwordsMatch) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1);
      res.cookie("AuthCookie", user["_id"], { expires: expiresAt });
      req.session.user = user;
      res.redirect('/user/view_profile');
    }
    else {
      res.render("login", {error: "Incorrect login and/or password."});
      return;
    }

});

module.exports = router;