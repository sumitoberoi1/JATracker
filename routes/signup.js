const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const uuid = require('uuid/v4');

router.get("/", async (req, res) => {
	res.render("signup");
});

router.post("/", async (req, res) => {
	const username = req.body.username;
    const password = req.body.password;
    const Re_enter_password = req.body.Re_enter_password
    const email = req.body.email

	let error_message = "Account with that username already exists";
	let signUp = false;
    try 
    {
        signUp = await userData.signUp(username, password, Re_enter_password, email);
    } 
    catch (e) 
    {
		error_message = e
	}
	
    if (signUp) 
    {
		// Create cookie
		let sID = uuid();
		res.cookie("AuthCookie", sID);
		userData.addUserSessionID(signUp._id, sID);

		res.redirect("/account");
    } 
    else 
    {
		let data = {
			error: error_message
		}
		res.render("signp", data);
	}

	return true;
});

module.exports = router;