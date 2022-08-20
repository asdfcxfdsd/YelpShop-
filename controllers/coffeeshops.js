const Coffeeshop = require("../models/coffeeshop");
const { cloudinary } = require("../cloudinary");

//Mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN; 
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); 



module.exports.index = async (req, res) => {
  const coffeeshops = await Coffeeshop.find({});
  res.render("coffeeshops/index", { coffeeshops });
};

module.exports.renderNewForm = (req, res) => {
  res.render("coffeeshops/new");
};

module.exports.createNewCoffeeshop = async (req, res) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.coffeeshop.location,
    limit: 1
  }).send()
   const coffeeshop = new Coffeeshop(req.body.coffeeshop);
    
    coffeeshop.geometry = geoData.body.features[0].geometry; 

    // Defined images
  coffeeshop.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  // CHANGE AUTHOR NAME TO CURRENT USER.
  coffeeshop.author = req.user;
  await coffeeshop.save();
  console.log(coffeeshop)
  req.flash("success", "Successfully made a new coffeeshop!!!");
  res.redirect(`/coffeeshops/${coffeeshop._id}`);
};

module.exports.renderShowPage = async (req, res) => {
  // const {id} = req.params;
  const coffeeshop = await Coffeeshop.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!coffeeshop) {
    req.flash("error", "Can not find the coffeeshop!!!");
    return res.redirect(`/coffeeshops`);
  }
  res.render("coffeeshops/show", { coffeeshop });
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const coffeeshop = await Coffeeshop.findById(id);

  if (!coffeeshop) {
    req.flash("error", "Can not find the coffeeshop!!!");
    return res.redirect(`/coffeeshops`);
  }
  res.render("coffeeshops/edit", { coffeeshop });
};

module.exports.editCoffeeshop = async (req, res, next) => {
  const { id } = req.params;
  const coffeeshop = await Coffeeshop.findByIdAndUpdate(id, {
    ...req.body.coffeeshop,
  });
  // console.log(req.body)
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  coffeeshop.images.push(...imgs);
  await coffeeshop.save();

  // delete照片
  if (req.body.deleteImages) {
    //Remove Photos From Cloudinary.
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    // Remove pics in DB. 
    await coffeeshop.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Successfully updated a new coffeeshop!!!");
  res.redirect(`/coffeeshops/${id}`);
};

module.exports.deleteCoffeeshop = async (req, res) => {
  const { id } = req.params;
  await Coffeeshop.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the coffeeshop !!!");
  res.redirect(`/coffeeshops`);
};
