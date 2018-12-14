const passport = require("passport");
const userData = require("../data/users");
const LocalStrategy = require("passport-local").Strategy;
module.exports.setup = function () {
    passport.serializeUser((user,done) => {
        console.log(`Error in Passport ${e}`)
        done(null,user._id)
    })
    passport.deserializeUser(async (id,done) => {   
        try {
            const user = await userData.getUserByID(id)
            done(null,user)
        } catch (e) {
            console.log(`Error in Passport ${e}`)
            done(e,user)
        }
    })
    passport.use(`local`,new LocalStrategy(async (userName,password,done) => {
        try {
            const user = await userData.getUserByUsername(userName);
            const passwordsMatch = await bcrypt.compare(password, user.hashedPassword);
            if (passwordsMatch) {
                return done(null,user)
            } else {
                return done(null,false,{message:'Invalid Password'});
            }
        } catch(e) {
            return done(null,false,{message:'Invalid Password'});
        }
    }))
    } ,
    

module.exports.ensureAuthenticated = (req,res,next) => {
    if (req.isAuthenticated) {
        next()
    } else {
        res.flash("info", "You must be logged in to see this page.")
        res.redirect("/login");
    }
}