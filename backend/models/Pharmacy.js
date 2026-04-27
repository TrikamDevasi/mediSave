const mongoose = require('mongoose');

const PharmacySchema = new mongoose.Schema({
  name: String,
  type: {
    type: String,
    enum: ['local', 'apollo', 'medplus', 'janaushadhi', 'netmeds']
  },
  address: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  phone: String,
  timings: String,
  rating: Number,
  inventory: [{
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    price: Number,
    inStock: { type: Boolean, default: true }
  }]
});

PharmacySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Pharmacy', PharmacySchema);
