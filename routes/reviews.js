const express = require('express');
const router = express.Router({mergeParams: true});

const Coffeeshop = require('../models/coffeeshop');
const Review = require('../models/review');



// Error Handling. 
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError'); 
const {coffeeshopSchema, reviewSchema} = require('../schemas'); 

const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware'); 
 
// Controllers 
const reviews = require('../controllers/reviews');




// Review Routes 
router.post('/', isLoggedIn,validateReview, catchAsync(reviews.createReview));   

router.delete('/:reviewId', isReviewAuthor,isLoggedIn,reviews.deleteReview); 

module.exports = router; 