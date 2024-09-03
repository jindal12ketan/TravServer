const TravData = require('../models/TravData');

const getTravData = async (req, res) => {
  try {
    const data = await TravData.find();
    res.send(data);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  getTravData,
};
