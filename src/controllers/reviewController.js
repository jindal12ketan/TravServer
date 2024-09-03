const TravData = require('../models/TravData');

const addReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, customerName } = req.body;

    const product = await TravData.findById(id);

    if (!product) {
      res.status(404).send('Product not found');
      return;
    }

    const review = { rating, comment, customerName };
    product.reviews.push(review);
    await product.save();

    res.status(201).send(product.reviews);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  addReview,
};
