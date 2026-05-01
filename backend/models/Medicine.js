const mongoose = require('mongoose');

const MedicineSchema = new mongoose.Schema({
  brandName: { type: String, index: true },
  genericName: { type: String, index: true },
  composition: String,
  manufacturer: String,
  mrp: Number,
  janAushadhiPrice: Number,
  category: String,
  cdscoApproved: { type: Boolean, default: true },
  alternatives: [{
    genericName: String,
    price: Number,
    manufacturer: String
  }],
  sideEffects: [String],
  interactions: [String],
  createdAt: { type: Date, default: Date.now }
});

MedicineSchema.index(
  { brandName: 'text', genericName: 'text', composition: 'text' },
  { weights: { brandName: 3, genericName: 3, composition: 2 }, name: 'medicine_text_index' }
);

module.exports = mongoose.model('Medicine', MedicineSchema);
