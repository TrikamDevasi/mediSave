const Medicine = require('../../models/Medicine');

const findGenericAlternatives = async (brandMedicineName) => {
  try {
    const medicine = await Medicine.findOne({
      $or: [
        { brandName: new RegExp(brandMedicineName, 'i') },
        { genericName: new RegExp(brandMedicineName, 'i') }
      ]
    }).lean();
    
    if (!medicine) return [];
    
    const composition = medicine.composition;
    const generics = await Medicine.find({
      composition: new RegExp(composition, 'i'),
      cdscoApproved: true
    }).sort({ mrp: 1 }).lean();
    
    return generics.map(generic => ({
      genericName: generic.genericName,
      manufacturer: generic.manufacturer,
      price: generic.mrp,
      janAushadhiPrice: generic.janAushadhiPrice,
      savingsPercent: generic.janAushadhiPrice
        ? ((generic.mrp - generic.janAushadhiPrice) / generic.mrp * 100).toFixed(1)
        : null
    }));
  } catch (error) {
    console.error('Generic matching error:', error.message);
    return [];
  }
};

const calculateSavings = (brandPrice, genericPrice) => {
  const saved = brandPrice - genericPrice;
  const percent = ((saved / brandPrice) * 100).toFixed(1);
  return { saved, percent };
};

module.exports = { findGenericAlternatives, calculateSavings };
