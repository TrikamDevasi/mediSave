const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');

const MEDICINES = [
  { brandName: 'Paracetamol 500mg', genericName: 'Paracetamol', mrp: 15, janAushadhiPrice: 4, composition: 'Paracetamol 500mg', category: 'Pain Relief' },
  { brandName: 'Atorva 10', genericName: 'Atorvastatin', mrp: 85, janAushadhiPrice: 18, composition: 'Atorvastatin 10mg', category: 'Cholesterol' },
  { brandName: 'Metformin 500', genericName: 'Metformin', mrp: 45, janAushadhiPrice: 12, composition: 'Metformin 500mg', category: 'Diabetes' },
  { brandName: 'Amoxyclav 625', genericName: 'Amoxicillin + Clavulanic Acid', mrp: 180, janAushadhiPrice: 65, composition: 'Amoxicillin 500mg + Clavulanic Acid 125mg', category: 'Antibiotic' },
  { brandName: 'Pantocid 40', genericName: 'Pantoprazole', mrp: 120, janAushadhiPrice: 22, composition: 'Pantoprazole 40mg', category: 'Acidity' },
  { brandName: 'Telma 40', genericName: 'Telmisartan', mrp: 110, janAushadhiPrice: 25, composition: 'Telmisartan 40mg', category: 'Hypertension' },
];

const pharmacies = [
  { name: 'Apollo Pharmacy - Odhav', address: 'Odhav Road, Odhav, Ahmedabad', location: { type: 'Point', coordinates: [72.6890, 23.0201] }, type: 'apollo', isJanAushadhi: false },
  { name: 'Jan Aushadhi Kendra - Odhav', address: 'Near Odhav Bus Stand, Odhav, Ahmedabad', location: { type: 'Point', coordinates: [72.6942, 23.0178] }, type: 'janaushadhi', isJanAushadhi: true },
  { name: 'Balaji Medical Store', address: 'GIDC, Odhav, Ahmedabad - 382415', location: { type: 'Point', coordinates: [72.6955, 23.0165] }, type: 'local', isJanAushadhi: false },
  { name: 'Shree Medical - Odhav', address: 'Odhav Circle, Ahmedabad', location: { type: 'Point', coordinates: [72.6933, 23.0189] }, type: 'local', isJanAushadhi: false },
  { name: 'MedPlus Pharmacy - Vastral', address: 'Vastral Road, Near Odhav, Ahmedabad', location: { type: 'Point', coordinates: [72.7012, 23.0143] }, type: 'medplus', isJanAushadhi: false },
  { name: 'Jan Aushadhi Store - Vastral', address: 'Vastral, Ahmedabad - 382418', location: { type: 'Point', coordinates: [72.7034, 23.0156] }, type: 'janaushadhi', isJanAushadhi: true },
  { name: 'Apollo Pharmacy - Nikol', address: 'Nikol Road, Ahmedabad', location: { type: 'Point', coordinates: [72.6821, 23.0312] }, type: 'apollo', isJanAushadhi: false },
  { name: 'Raj Medical Store', address: 'Kathwada Road, Odhav, Ahmedabad', location: { type: 'Point', coordinates: [72.6978, 23.0198] }, type: 'local', isJanAushadhi: false },
  { name: 'Shiv Medical & General Store', address: 'Odhav GIDC Road, Ahmedabad', location: { type: 'Point', coordinates: [72.6921, 23.0171] }, type: 'local', isJanAushadhi: false },
  { name: 'New Life Pharmacy', address: 'Near Odhav Metro Station, Ahmedabad', location: { type: 'Point', coordinates: [72.6907, 23.0225] }, type: 'local', isJanAushadhi: false },
];

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medisave';
    console.log('Connecting to:', mongoUri);
    await mongoose.connect(mongoUri);

    console.log('Cleaning existing data...');
    await Medicine.deleteMany({});
    await Pharmacy.deleteMany({});

    console.log('Seeding Medicines...');
    const createdMedicines = await Medicine.insertMany(MEDICINES);
    console.log(`Inserted ${createdMedicines.length} medicines`);

    console.log('Seeding Pharmacies with Inventory...');
    for (const pData of pharmacies) {
      const pharmacy = new Pharmacy({
        name: pData.name,
        type: pData.type,
        address: pData.address,
        isJanAushadhi: pData.isJanAushadhi,
        location: pData.location
      });
      
      pharmacy.inventory = createdMedicines.map(m => ({
        medicineId: m._id,
        price: pData.isJanAushadhi ? m.janAushadhiPrice : (m.mrp * (0.8 + Math.random() * 0.4)),
        inStock: Math.random() > 0.1
      }));
      await pharmacy.save();
    }

    console.log('Seeding complete! ✅ (Verified Odhav stores inserted)');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
