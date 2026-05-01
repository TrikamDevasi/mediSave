const fs = require('fs');
const path = require('path');

const drugSafetyPath = path.join(__dirname, 'data/drug-safety.json');

const loadDrugData = () => {
  try {
    return JSON.parse(fs.readFileSync(drugSafetyPath, 'utf-8'));
  } catch (error) {
    console.error('Failed to load drug safety data:', error.message);
    return [];
  }
};

const cleanMedicineName = (name) => {
  return name
    .replace(/\d+\s*mg/gi, '')
    .replace(/\d+\s*ml/gi, '')
    .replace(/\(.*?\)/g, '')
    .trim();
};

const matchGenerics = (medicineNames) => {
  const drugData = loadDrugData();
  const results = [];
  
  for (const name of medicineNames) {
    const cleaned = cleanMedicineName(name);
    
    const match = drugData.find(d => 
      d.medicine.toLowerCase() === cleaned.toLowerCase() ||
      d.commonBrands.some(b => b.toLowerCase() === cleaned.toLowerCase()) ||
      cleaned.toLowerCase().includes(d.medicine.toLowerCase())
    );
    
    if (match) {
      const savingsPercent = match.janAushadhiPrice
        ? ((match.typicalMRP - match.janAushadhiPrice) / match.typicalMRP * 100).toFixed(1)
        : null;
      
      results.push({
        original: name,
        generic: match.medicine,
        brands: match.commonBrands,
        mrp: match.typicalMRP,
        janAushadhiPrice: match.janAushadhiPrice,
        savingsPercent,
        category: match.category
      });
    } else {
      results.push({
        original: name,
        generic: null,
        brands: [],
        mrp: null,
        janAushadhiPrice: null,
        savingsPercent: null,
        category: null
      });
    }
  }
  
  return results;
};

module.exports = { matchGenerics, cleanMedicineName };
