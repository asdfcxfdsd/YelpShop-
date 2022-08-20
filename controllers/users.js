const User = require('../models/user'); 


module.exports.showRegisterForm= (req, res) => {
    res.render('users/register');
}

module.exports.createNewUser = async(req, res) => {
    try{
    const {username, email, password}= req.body;
    // Password don't need to be stored. 
    const user = new User({
        email,
        username
    })
    const newUser = await User.register(user, password);  
    // LOGIN OUR ACCOUNT WHILE WE FINISH registered. 
    req.login(newUser, err => {
        if (err) return next(err); 
        req.flash('success', 'Welcome to YelpShop!!! '); 
        res.redirect(`/coffeeshops`); 
    })
}catch(e) {
    req.flash('error', e.message); 
    res.redirect(`register`);
}
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = async(req, res) => {
    req.flash('success', `Welcome come back ${req.user.username}`); 
    // Return To function. User will go back where they originally are before logging in, if they log in successfully. 
    // console.log(req.user);
    const redirectUrl = req.session.returnTo || '/coffeeshops'; 
    delete req.session.returnTo;
    res.redirect(redirectUrl); 
}

module.exports.logout = function(req, res, next) {
    //  We don't need give an argument in passport0.5.0. 
    // req.logout(function(err) {
    //   if (err) { return next(err); }
    //   req.flash('success', 'Goodbye');
    //   res.redirect('/coffeeshops');
    // });
    req.logout();
    req.flash('success', 'Goodbye');
    res.redirect('/coffeeshops');
  }