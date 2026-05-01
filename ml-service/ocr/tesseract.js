const Tesseract = require('tesseract.js');

const scanWithTesseract = async (base64Image) => {
  try {
    console.time('tesseract-ocr');
    const buffer = Buffer.from(base64Image, 'base64');
    
    const result = await Tesseract.recognize(buffer, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`Tesseract: ${Math.round(m.progress * 100)}%`);
        }
      }
    });
    console.timeEnd('tesseract-ocr');
    
    return result.data.text;
  } catch (error) {
    console.error('Tesseract OCR error:', error.message);
    return '';
  }
};

const parseRawText = (text) => {
  const medicines = [];
  const lines = text.split('\n').filter(l => l.trim());
  
  for (const line of lines) {
    const medMatch = line.match(/([A-Za-z\s]+)\s*(\d+\s*mg|\d+\s*ml)?/i);
    if (medMatch && line.length > 3) {
      medicines.push({
        name: medMatch[1].trim(),
        dosage: medMatch[2] ? medMatch[2].trim() : null,
        frequency: null,
        duration: null,
        confidence: 0.3
      });
    }
  }
  
  return {
    medicines: medicines.slice(0, 10),
    doctorName: null,
    date: null,
    rawText: text
  };
};

module.exports = { scanWithTesseract, parseRawText };
