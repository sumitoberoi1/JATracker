const express = require("express");
const userData = require("../data/users");
const bcrypt = require('bcrypt');
const router = express.Router();
let loginData = {layout:false,title:'Login'}
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
                loginData.error = e
                res.render("login", loginData);
                return;
            }
            req.session.user = user;
        }
        res.redirect('/user/edit_profile');
    }
    else {
        res.render('login',{layout:false, title:'Login'});
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
        loginData.error = e
        res.render("login", loginData);
        return;
	}
    if (!user) {
        loginData.error =  "Username is not valid"
        res.render("login", loginData);
        return;
    }
    const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
    if (passwordsMatch) {
      res.cookie("AuthCookie", user["_id"]);
      req.session.user = user;
      res.redirect('/user/view_profile');
    }
    else {
      loginData.error = "Incorrect login and/or password."
      res.render("login", loginData);
      return;
    }

});

module.exports = router;