const mongoose = require('mongoose');
const Coffeeshop = require("../models/coffeeshop");
const axios = require("axios").default;


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/coffee-shop';

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(dbUrl).then(() => {
    console.log("Data connected");
  });
}

// console.log(process.env.DB_URL) 
// console.log(dbUrl)



const sample = (array) => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
  await Coffeeshop.deleteMany({});
  const shop = await axios
    .get("https://cafenomad.tw/api/v1.2/cafes/")
    .then((res) => {
      return res;
    });

  for (let i = 0; i < 10; i++) {
    const random100 = Math.floor(Math.random() * 100);
    const price = Math.floor(Math.random() * 20) + 10;

    const coffeeshop = new Coffeeshop({
      title: shop.data[random100].name,
      location: shop.data[random100].address,
      geometry:{
        type: 'Point',
        coordinates: [
          shop.data[random100].longitude,
          shop.data[random100].latitude
        ]
      },
      images:
      [
        {
          url: 'https://res.cloudinary.com/dep2h8x8y/image/upload/v1660464902/YelpShop/image_miwhxb.jpg',
          filename: 'YelpShop/image_miwhxb'
        },
        {
          url: 'https://res.cloudinary.com/dep2h8x8y/image/upload/v1659498058/YelpShop/i7wxzhivjopno3vo5vef.jpg',
          filename: 'YelpShop/i7wxzhivjopno3vo5vef'
        }
      ],
      price: price,
      author: "630c48d5469778e7cb912bfa",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!"
    });
    await coffeeshop.save();
  }
  
};


seedDB().then(() => {
  mongoose.connection.close();
});
