const FormData = require("../models/FormData");

const submitForm = async (req, res) => {
  try {
    const { name, lastName, email, password, age, gender, address } = req.body;
    const isValid =
      typeof name === "string" &&
      name.trim() &&
      typeof lastName === "string" &&
      lastName.trim() &&
      /^\S+@\S+\.\S+$/.test(email || "") &&
      typeof password === "string" &&
      password.length >= 6 &&
      Number(age) > 0 &&
      typeof gender === "string" &&
      gender.trim() &&
      typeof address === "string" &&
      address.trim();

    if (!isValid) {
      return res.status(400).send("Invalid form input");
    }

    const formData = new FormData(req.body);
    await formData.save();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

module.exports = {
  submitForm,
};
