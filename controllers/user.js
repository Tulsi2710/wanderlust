const User = require("../models/user");

module.exports.signUpForm = (req,res)=> {
    res.render("users/signup.ejs");
};

module.exports.signUp = async(req,res)=> {
    try{
      let {username, email,password} = req.body;
      let newUser = new User({username,email});
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.login(registeredUser, (err)=> {
        if(err) {
            return next(err);
        }
          req.flash("success", "Welcome to Wanderlust");
          return res.redirect("/listings");
      })
    } catch(e) {
        req.flash("error", e.message);
        return res.redirect("/signup")
    }  
};

module.exports.loginForm = (re,res)=> {
    return res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    return res.redirect("/listings");
};

module.exports.logout = (req,res,next)=> {
    req.logout((err)=> {
        if(err) {
            return next(err);
        } 
        req.flash("success", "you are logged out");
        return res.redirect("/listings");
    })
};