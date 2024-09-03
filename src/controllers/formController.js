const FormData = require('../models/FormData');

const submitForm = async (req, res) => {
  try {
    const formData = new FormData(req.body);
    await formData.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  submitForm,
};
