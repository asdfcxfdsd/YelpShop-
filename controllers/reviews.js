const Review = require('../models/review');
const Coffeeshop = require('../models/coffeeshop');

module.exports.createReview = async(req, res, next) => { 
    const coffeeshop = await Coffeeshop.findById(req.params.id);
    const review = new Review(req.body.review); 
    // RESET THE AUTHOR OF REVIEW WHEN WE MADE A NEW COMMENT. 
    review.author = req.user._id; 

    coffeeshop.reviews.push(review);
    await coffeeshop.save();
    await review.save();
    req.flash('success', 'Successfully made a new review!!!')
    res.redirect(`/coffeeshops/${coffeeshop._id}`);
}

module.exports.deleteReview = async(req, res, next)=> {
    const {id, reviewId} = req.params;
    await Coffeeshop.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted the review!!!')
    res.redirect(`/coffeeshops/${id}`);
}