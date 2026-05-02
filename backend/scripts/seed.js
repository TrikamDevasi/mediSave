require('dotenv').config();
const mongoose = require('mongoose');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');

const medicines = [
  { brandName: 'Lipitor', genericName: 'Atorvastatin', composition: 'Atorvastatin 10mg', manufacturer: 'Pfizer', mrp: 98, janAushadhiPrice: 8, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['muscle pain', 'liver issues'], interactions: ['warfarin', 'cyclosporine'] },
  { brandName: 'Tonact', genericName: 'Atorvastatin', composition: 'Atorvastatin 10mg', manufacturer: 'Lupin', mrp: 85, janAushadhiPrice: 8, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['muscle pain'], interactions: ['gemfibrozil'] },
  { brandName: 'Storvas', genericName: 'Atorvastatin', composition: 'Atorvastatin 10mg', manufacturer: 'Ranbaxy', mrp: 90, janAushadhiPrice: 8, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['headache'], interactions: ['cyclosporine'] },
  { brandName: 'Glycomet', genericName: 'Metformin', composition: 'Metformin 500mg', manufacturer: 'USV', mrp: 45, janAushadhiPrice: 6, category: 'Antidiabetic', cdscoApproved: true, sideEffects: ['nausea', 'diarrhea'], interactions: ['alcohol'] },
  { brandName: 'Glucophage', genericName: 'Metformin', composition: 'Metformin 500mg', manufacturer: 'Merck', mrp: 55, janAushadhiPrice: 6, category: 'Antidiabetic', cdscoApproved: true, sideEffects: ['stomach upset'], interactions: ['contrast dye'] },
  { brandName: 'Amlodac', genericName: 'Amlodipine', composition: 'Amlodipine 5mg', manufacturer: 'Zydus', mrp: 40, janAushadhiPrice: 5, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['edema', 'dizziness'], interactions: ['simvastatin'] },
  { brandName: 'Amlogard', genericName: 'Amlodipine', composition: 'Amlodipine 5mg', manufacturer: 'Blue Cross', mrp: 42, janAushadhiPrice: 5, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['flushing'], interactions: ['grapefruit juice'] },
  { brandName: 'Pan', genericName: 'Pantoprazole', composition: 'Pantoprazole 40mg', manufacturer: 'Alkem', mrp: 65, janAushadhiPrice: 7, category: 'Antacid', cdscoApproved: true, sideEffects: ['headache', 'diarrhea'], interactions: ['warfarin'] },
  { brandName: 'Pantocid', genericName: 'Pantoprazole', composition: 'Pantoprazole 40mg', manufacturer: 'Cipla', mrp: 70, janAushadhiPrice: 7, category: 'Antacid', cdscoApproved: true, sideEffects: ['nausea'], interactions: ['atazanavir'] },
  { brandName: 'Azithral', genericName: 'Azithromycin', composition: 'Azithromycin 500mg', manufacturer: 'Alembic', mrp: 120, janAushadhiPrice: 25, category: 'Antibiotic', cdscoApproved: true, sideEffects: ['stomach pain', 'diarrhea'], interactions: ['antacids'] },
  { brandName: 'Azee', genericName: 'Azithromycin', composition: 'Azithromycin 500mg', manufacturer: 'Cipla', mrp: 115, janAushadhiPrice: 25, category: 'Antibiotic', cdscoApproved: true, sideEffects: ['nausea'], interactions: ['digoxin'] },
  { brandName: 'Crocin', genericName: 'Paracetamol', composition: 'Paracetamol 500mg', manufacturer: 'GSK', mrp: 25, janAushadhiPrice: 3, category: 'Analgesic', cdscoApproved: true, sideEffects: ['rash'], interactions: ['warfarin'] },
  { brandName: 'Dolo 650', genericName: 'Paracetamol', composition: 'Paracetamol 650mg', manufacturer: 'Micro Labs', mrp: 30, janAushadhiPrice: 4, category: 'Analgesic', cdscoApproved: true, sideEffects: ['liver damage at high dose'], interactions: [] },
  { brandName: 'Cifran', genericName: 'Ciprofloxacin', composition: 'Ciprofloxacin 500mg', manufacturer: 'Ranbaxy', mrp: 85, janAushadhiPrice: 10, category: 'Antibiotic', cdscoApproved: true, sideEffects: ['tendon rupture', 'diarrhea'], interactions: ['antacids', 'warfarin'] },
  { brandName: 'Losar', genericName: 'Losartan', composition: 'Losartan 50mg', manufacturer: 'Unichem', mrp: 55, janAushadhiPrice: 8, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['dizziness', 'cough'], interactions: ['potassium supplements'] },
  { brandName: 'Omez', genericName: 'Omeprazole', composition: 'Omeprazole 20mg', manufacturer: 'Dr Reddy', mrp: 50, janAushadhiPrice: 6, category: 'Antacid', cdscoApproved: true, sideEffects: ['headache', 'abdominal pain'], interactions: ['clopidogrel'] },
  { brandName: 'Zyrtec', genericName: 'Cetirizine', composition: 'Cetirizine 10mg', manufacturer: 'Dr Reddy', mrp: 35, janAushadhiPrice: 4, category: 'Antiallergic', cdscoApproved: true, sideEffects: ['drowsiness'], interactions: ['alcohol'] },
  { brandName: 'Mox', genericName: 'Amoxicillin', composition: 'Amoxicillin 500mg', manufacturer: 'Cipla', mrp: 75, janAushadhiPrice: 12, category: 'Antibiotic', cdscoApproved: true, sideEffects: ['diarrhea', 'rash'], interactions: ['allopurinol'] },
  { brandName: 'Brufen', genericName: 'Ibuprofen', composition: 'Ibuprofen 400mg', manufacturer: 'Abbott', mrp: 40, janAushadhiPrice: 8, category: 'Analgesic', cdscoApproved: true, sideEffects: ['stomach ulcer', 'kidney issues'], interactions: ['aspirin', 'warfarin'] },
  { brandName: 'Montair', genericName: 'Montelukast', composition: 'Montelukast 10mg', manufacturer: 'Cipla', mrp: 95, janAushadhiPrice: 15, category: 'Respiratory', cdscoApproved: true, sideEffects: ['headache', 'mood changes'], interactions: ['gemfibrozil'] },
  { brandName: 'Ramistar', genericName: 'Ramipril', composition: 'Ramipril 5mg', manufacturer: 'Lupin', mrp: 48, janAushadhiPrice: 7, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['dry cough', 'dizziness'], interactions: ['potassium-sparing diuretics'] },
  { brandName: 'Ecosprin', genericName: 'Aspirin', composition: 'Aspirin 75mg', manufacturer: 'USV', mrp: 20, janAushadhiPrice: 3, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['stomach irritation', 'bleeding'], interactions: ['warfarin', 'clopidogrel'] },
  { brandName: 'Metolar', genericName: 'Metoprolol', composition: 'Metoprolol 25mg', manufacturer: 'Cipla', mrp: 38, janAushadhiPrice: 6, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['fatigue', 'dizziness'], interactions: ['verapamil'] },
  { brandName: 'Glimy', genericName: 'Glimepiride', composition: 'Glimepiride 1mg', manufacturer: 'Dr Reddy', mrp: 42, janAushadhiPrice: 7, category: 'Antidiabetic', cdscoApproved: true, sideEffects: ['hypoglycemia'], interactions: ['beta-blockers'] },
  { brandName: 'Telma', genericName: 'Telmisartan', composition: 'Telmisartan 40mg', manufacturer: 'Glenmark', mrp: 60, janAushadhiPrice: 9, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['dizziness', 'back pain'], interactions: ['ibuprofen'] },
  { brandName: 'Rozucor', genericName: 'Rosuvastatin', composition: 'Rosuvastatin 10mg', manufacturer: 'Sun Pharma', mrp: 105, janAushadhiPrice: 12, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['muscle pain', 'diabetes risk'], interactions: ['cyclosporine'] },
  { brandName: 'Nexpro', genericName: 'Esomeprazole', composition: 'Esomeprazole 20mg', manufacturer: 'Torrent', mrp: 72, janAushadhiPrice: 9, category: 'Antacid', cdscoApproved: true, sideEffects: ['headache', 'nausea'], interactions: ['clopidogrel'] },
  { brandName: 'Levoset', genericName: 'Levocetirizine', composition: 'Levocetirizine 5mg', manufacturer: 'Cipla', mrp: 45, janAushadhiPrice: 6, category: 'Antiallergic', cdscoApproved: true, sideEffects: ['drowsiness'], interactions: ['alcohol'] },
  { brandName: 'Combiflam', genericName: 'Ibuprofen+Paracetamol', composition: 'Ibuprofen 400mg + Paracetamol 325mg', manufacturer: 'Sanofi', mrp: 35, janAushadhiPrice: 8, category: 'Analgesic', cdscoApproved: true, sideEffects: ['stomach upset'], interactions: ['warfarin'] },
  { brandName: 'Aspirin', genericName: 'Aspirin', composition: 'Aspirin 150mg', manufacturer: 'Bayer', mrp: 28, janAushadhiPrice: 4, category: 'Cardiovascular', cdscoApproved: true, sideEffects: ['bleeding'], interactions: ['heparin'] }
];

const pharmacies = [
  { name: 'Apollo Pharmacy - Satellite', type: 'apollo', address: 'Satellite Road, Ahmedabad', location: { type: 'Point', coordinates: [72.569, 23.025] }, phone: '079-12345678', timings: '9AM-10PM', rating: 4.5, inventory: [] },
  { name: 'Apollo Pharmacy - Navrangpura', type: 'apollo', address: 'Navrangpura, Ahmedabad', location: { type: 'Point', coordinates: [72.562, 23.036] }, phone: '079-23456789', timings: '9AM-10PM', rating: 4.3, inventory: [] },
  { name: 'Apollo Pharmacy - Maninagar', type: 'apollo', address: 'Maninagar, Ahmedabad', location: { type: 'Point', coordinates: [72.600, 22.999] }, phone: '079-34567890', timings: '8AM-11PM', rating: 4.4, inventory: [] },
  { name: 'Apollo Pharmacy - Bopal', type: 'apollo', address: 'Bopal, Ahmedabad', location: { type: 'Point', coordinates: [72.511, 23.017] }, phone: '079-45678901', timings: '9AM-9PM', rating: 4.2, inventory: [] },
  { name: 'Apollo Pharmacy - Vastrapur', type: 'apollo', address: 'Vastrapur, Ahmedabad', location: { type: 'Point', coordinates: [72.540, 23.041] }, phone: '079-56789012', timings: '9AM-10PM', rating: 4.6, inventory: [] },
  { name: 'MedPlus - CG Road', type: 'medplus', address: 'CG Road, Ahmedabad', location: { type: 'Point', coordinates: [72.558, 23.030] }, phone: '079-67890123', timings: '8AM-10PM', rating: 4.1, inventory: [] },
  { name: 'MedPlus - Paldi', type: 'medplus', address: 'Paldi, Ahmedabad', location: { type: 'Point', coordinates: [72.565, 23.015] }, phone: '079-78901234', timings: '9AM-9PM', rating: 4.0, inventory: [] },
  { name: 'MedPlus - Thaltej', type: 'medplus', address: 'Thaltej, Ahmedabad', location: { type: 'Point', coordinates: [72.520, 23.050] }, phone: '079-89012345', timings: '8AM-11PM', rating: 4.3, inventory: [] },
  { name: 'MedPlus - Sola', type: 'medplus', address: 'Sola, Ahmedabad', location: { type: 'Point', coordinates: [72.495, 23.045] }, phone: '079-90123456', timings: '9AM-10PM', rating: 4.2, inventory: [] },
  { name: 'MedPlus - Gota', type: 'medplus', address: 'Gota, Ahmedabad', location: { type: 'Point', coordinates: [72.485, 23.060] }, phone: '079-01234567', timings: '9AM-9PM', rating: 4.0, inventory: [] },
  { name: 'Shreeji Medical Store', type: 'local', address: 'Naranpura, Ahmedabad', location: { type: 'Point', coordinates: [72.555, 23.045] }, phone: '079-11111111', timings: '8AM-10PM', rating: 4.0, inventory: [] },
  { name: 'City Pharmacy', type: 'local', address: 'Kalupur, Ahmedabad', location: { type: 'Point', coordinates: [72.590, 23.030] }, phone: '079-22222222', timings: '7AM-11PM', rating: 3.8, inventory: [] },
  { name: 'Wellness Pharmacy', type: 'local', address: 'Isanpur, Ahmedabad', location: { type: 'Point', coordinates: [72.610, 22.980] }, phone: '079-33333333', timings: '9AM-9PM', rating: 3.9, inventory: [] },
  { name: 'Suncity Medical', type: 'local', address: 'S.G. Highway, Ahmedabad', location: { type: 'Point', coordinates: [72.500, 23.055] }, phone: '079-44444444', timings: '8AM-10PM', rating: 4.1, inventory: [] },
  { name: 'Hari Medical Store', type: 'local', address: 'Bapunagar, Ahmedabad', location: { type: 'Point', coordinates: [72.625, 23.050] }, phone: '079-55555555', timings: '7AM-10PM', rating: 3.7, inventory: [] },
  { name: 'Jan Aushadhi - Satellite', type: 'janaushadhi', address: 'Satellite, Ahmedabad', location: { type: 'Point', coordinates: [72.569, 23.025] }, phone: '1800-111-123', timings: '9AM-6PM', rating: 4.0, inventory: [] },
  { name: 'Jan Aushadhi - Navrangpura', type: 'janaushadhi', address: 'Navrangpura, Ahmedabad', location: { type: 'Point', coordinates: [72.562, 23.036] }, phone: '1800-111-124', timings: '9AM-6PM', rating: 4.2, inventory: [] },
  { name: 'Jan Aushadhi - Maninagar', type: 'janaushadhi', address: 'Maninagar, Ahmedabad', location: { type: 'Point', coordinates: [72.600, 22.999] }, phone: '1800-111-125', timings: '9AM-6PM', rating: 3.9, inventory: [] },
  { name: 'Jan Aushadhi - Bopal', type: 'janaushadhi', address: 'Bopal, Ahmedabad', location: { type: 'Point', coordinates: [72.511, 23.017] }, phone: '1800-111-126', timings: '9AM-6PM', rating: 4.1, inventory: [] },
  { name: 'Jan Aushadhi - Vastrapur', type: 'janaushadhi', address: 'Vastrapur, Ahmedabad', location: { type: 'Point', coordinates: [72.540, 23.041] }, phone: '1800-111-127', timings: '9AM-6PM', rating: 4.0, inventory: [] }
];

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    await Medicine.deleteMany({});
    await Pharmacy.deleteMany({});
    console.log('Cleared existing data');

    const insertedMedicines = await Medicine.insertMany(medicines);
    console.log(`Inserted ${insertedMedicines.length} medicines`);

    for (let pharmacy of pharmacies) {
      const randomMedicines = insertedMedicines
        .sort(() => 0.5 - Math.random())
        .slice(0, 10 + Math.floor(Math.random() * 5));

      pharmacy.inventory = randomMedicines.map(med => ({
        medicineId: med._id,
        price: med.mrp * (0.9 + Math.random() * 0.3),
        inStock: Math.random() > 0.2
      }));
    }

    const insertedPharmacies = await Pharmacy.insertMany(pharmacies);
    console.log(`Inserted ${insertedPharmacies.length} pharmacies`);

    console.log(`✅ Seeded ${insertedMedicines.length} medicines and ${insertedPharmacies.length} pharmacies`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

main();
