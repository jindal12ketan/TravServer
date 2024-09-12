const mongoose = require("mongoose");

const travDataSchema = new mongoose.Schema({
  id: { type: Number, unique: true },
  category: String,
  title: String,
  image: String,
  description: String,
  price: Number,
  location: {
    latitude: Number,
    longitude: Number,
  },
  reviews: [
    {
      customerName: String,
      rating: Number,
      comment: String,
    },
  ],
});

travDataSchema.pre("save", async function (next) {
  const doc = this;

  if (doc.isNew) {
    const lastDoc = await mongoose
      .model("TravData")
      .findOne({}, { id: 1 })
      .sort({ id: -1 });

    doc.id = lastDoc ? lastDoc.id + 1 : 1;
  }

  next();
});

module.exports = mongoose.model("TravData", travDataSchema);
