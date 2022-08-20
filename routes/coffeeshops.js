const express = require('express');
const router = express.Router();
const Coffeeshop = require('../models/coffeeshop');

//Multer
const multer  = require('multer')
const {storage} = require("../cloudinary"); 
const upload = multer({ storage }); 

// Error Handling. 
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError'); 
const {coffeeshopSchema, reviewSchema} = require('../schemas'); 


const {isLoggedIn, isAuthor, validateCoffeeshop} = require('../middleware');

//輸入controllers 
const coffeeshops = require('../controllers/coffeeshops'); 









// Index Page
router.get('/', catchAsync(coffeeshops.index))

router.get('/new', isLoggedIn,coffeeshops.renderNewForm)


router.post('/', isLoggedIn,upload.array('image'),validateCoffeeshop ,catchAsync(coffeeshops.createNewCoffeeshop)) 
// router.post('/', upload.array('image'),(req, res) => {
//     res.send("It worked"); 
//     console.log(req.files)
// })



// Show route
router.get('/:id', catchAsync(coffeeshops.renderShowPage))



router.get('/:id/edit', isAuthor,isLoggedIn,catchAsync(coffeeshops.renderEditForm))

router.put('/:id', isLoggedIn,isAuthor, upload.array("image"), validateCoffeeshop ,catchAsync(coffeeshops.editCoffeeshop))

// DELETE coffeeshops 
router.delete('/:id', isLoggedIn,catchAsync(coffeeshops.deleteCoffeeshop))


module.exports = router;
