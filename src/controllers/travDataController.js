const TravData = require("../models/TravData");

const getAllTravData = async (req, res) => {
  try {
    const data = await TravData.find();
    res.send(data);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

const buildFilters = ({ category, title, minPrice, maxPrice }) => {
  const filters = {};

  if (category) {
    filters.category = { $regex: new RegExp(category, "i") };
  }
  if (title) {
    filters.title = { $regex: new RegExp(title, "i") };
  }
  if (minPrice && maxPrice) {
    filters.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  }

  return filters;
};

const getFilterTravData = async (req, res) => {
  try {
    const { sort, page, limit } = req.query;
    const filters = buildFilters(req.body);
    const pipeline = [{ $match: filters }];

    if (page && limit) {
      pipeline.push({
        $skip: page * limit,
      });
      pipeline.push({
        $limit: parseInt(limit),
      });
    }

    if (sort) {
      pipeline.push({
        $sort: {
          price: sort === "asc" ? 1 : -1,
        },
      });
    }

    const travData = await TravData.aggregate(pipeline);
    res.json(travData);
  } catch (error) {
    console.error(error);
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
      location: { latitude, longitude },
      reviews: [],
    });

    await newTravData.save();
    res.status(201).json(newTravData);
  } catch (error) {
    console.error("Error saving travel data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllTravData,
  getFilterTravData,
  saveTravData,
};
