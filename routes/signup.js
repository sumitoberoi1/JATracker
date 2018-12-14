const express = require("express");
const router = express.Router();
const userData = require("../data/users");


router.get("/", async(req, res) => {
	res.render("signup");
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
    } catch (e) {
        res.render("signup", {error: error_message});
        return;
    }
    if (error_message !== ""){
        console.log(error_message);
        res.render("signup", {error: error_message});
        return;
    }
    try {
        signup = await userData.signUp(username, password, email);
        res.redirect("/login");
    } catch (e) {
        res.render("signup", {error: e});
        return;
    }
});

module.exports = router;