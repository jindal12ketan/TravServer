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
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
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

const TravData = mongoose.model("TravData", travDataSchema);

module.exports = TravData;
