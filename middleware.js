const Coffeeshop = require('./models/coffeeshop');
const Review = require('./models/review');

// Error Handling. 
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError'); 
const {coffeeshopSchema, reviewSchema} = require('./schemas'); 


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Define returnTo. 
        req.session.returnTo = req.originalUrl;
         
        req.flash('error', 'You must signed in!!!')
        res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const {id} = req.params; 
    const coffeeshop = await Coffeeshop.findById(id); 
    if (!coffeeshop.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that!!!")
        return res.redirect(`/coffeeshops/${coffeeshop.id}`)
    }
    next(); 
}

// USE JOI to validate coffeeshops. 
module.exports.validateCoffeeshop = (req, res, next) => {
    const {error} = coffeeshopSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else {
        next();
    }
}


// USE JOI to validate reviews. 
module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);  
    }else {
        next()
    }
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params; 
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to do that!!!");
        res.redirect(`/coffeeshops/${id}`); 
    }
    next();
}