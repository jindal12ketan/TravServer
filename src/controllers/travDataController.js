const TravData = require("../models/TravData");

const getAllTravData = async (req, res) => {
  try {
    const data = await TravData.find();
    res.send(data);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const getFilterTravData = async (req, res) => {
  try {
    const { sort } = req.query;
    const { category, title, minPrice, maxPrice } = req.body;
    const pipeline = [
      {
        $match: {
          ...(category && {
            category: { $regex: new RegExp(category, "i") },
          }),
          ...(title && {
            title: { $regex: new RegExp(title, "i") },
          }),
          ...(minPrice &&
            maxPrice && {
              price: { $gte: Number(minPrice), $lte: Number(maxPrice) },
            }),
        },
      },
      {
        $sort: {
          price: sort === "asc" ? 1 : -1,
        },
      },
    ];

    const travData = await TravData.aggregate(pipeline);

    res.json(travData);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const saveTravData = async (req, res) => {
  try {
    const { title, category, description, price, image, latitude, longitude } =
      req.body;
    const newTravData = new TravData({
      title,
      category,
      description,
      price,
      image,
      location: {
        latitude,
        longitude,
      },
      reviews: [],
    });

    await newTravData.save();
    res.status(201).json(newTravData);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  getAllTravData,
  getFilterTravData,
  saveTravData,
};
