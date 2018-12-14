const express = require("express");
const router = express.Router();
const userData = require("../data/users");
let signUpData = {layout:false, title:'Sign Up'}

router.get("/", async(req, res) => {
	res.render("signup",signUpData);
});

router.post("/", async (req, res) => {
	const username = req.body.username;
    const password = req.body.password;
    const repeated_password = req.body.repeatedPassword;
    const email = req.body.email;
    let error_message = "";

    if (req.body.password.length > 20) {error_message += "Password is too long <br>";}
    if (req.body.password.length < 8) {error_message += "Password is too short <br>";}

    if (!(password === repeated_password)) {error_message += "Passwords do not match <br>";}

    try{
        const user = await userData.getUserByUsername(username);
        if (user) {
            error_message += "Username already exists";
        }
        const userByEmail = await userData.getUserByEmail(email)
        if (userByEmail) {
            error_message += "Email already exists";
        }
        
    } catch (e) {
        signUpData.error = error_message
        res.render("signup",signUpData);
        return;
    }
    if (error_message !== ""){
        signUpData.error = error_message
        res.render("signup", signUpData);
        return;
    }
    try {
        signup = await userData.signUp(username, password, email);
        res.redirect("/user/edit_profile");
    } catch (e) {
        signUpData.error = e
        res.render("signup", signUpData);
        return;
    }
});

module.exports = router;