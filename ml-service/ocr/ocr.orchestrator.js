const { scanPrescriptionWithGemini } = require('./gemini');
const { scanPrescriptionWithOpenAI } = require('./openai');
const { scanWithTesseract, parseRawText } = require('./tesseract');

const orchestratePrescriptionScan = async (base64Image, mimeType = 'image/jpeg') => {
  let result = null;
  let source = 'none';
  let confidence = 0;
  
  try {
    console.log('Attempting OCR with Gemini...');
    result = await scanPrescriptionWithGemini(base64Image, mimeType);
    confidence = result.medicines?.reduce((sum, m) => sum + (m.confidence || 0), 0) / (result.medicines?.length || 1);
    
    if (confidence > 0.7 && result.medicines?.length > 0) {
      console.log(`Gemini OCR success: confidence=${confidence.toFixed(2)}, medicines=${result.medicines.length}`);
      return {
        medicines: result.medicines,
        source: 'gemini',
        confidence,
        rawText: result.rawText || ''
      };
    }
    console.log(`Gemini confidence too low: ${confidence.toFixed(2)}, trying OpenAI...`);
  } catch (error) {
    console.log('Gemini failed, trying OpenAI...', error.message);
  }
  
  try {
    result = await scanPrescriptionWithOpenAI(base64Image, mimeType);
    confidence = result.medicines?.reduce((sum, m) => sum + (m.confidence || 0), 0) / (result.medicines?.length || 1);
    
    if (result.medicines?.length > 0) {
      console.log(`OpenAI OCR success: confidence=${confidence.toFixed(2)}, medicines=${result.medicines.length}`);
      return {
        medicines: result.medicines,
        source: 'openai',
        confidence,
        rawText: result.rawText || ''
      };
    }
  } catch (error) {
    console.log('OpenAI failed, falling back to Tesseract...', error.message);
  }
  
  try {
    console.log('Using Tesseract OCR fallback...');
    const rawText = await scanWithTesseract(base64Image);
    result = parseRawText(rawText);
    confidence = 0.3;
    
    console.log(`Tesseract OCR complete: medicines=${result.medicines.length}`);
    return {
      medicines: result.medicines,
      source: 'tesseract',
      confidence,
      rawText: rawText
    };
  } catch (error) {
    console.error('All OCR methods failed:', error.message);
  }
  
  return {
    medicines: [],
    source: 'none',
    confidence: 0,
    rawText: ''
  };
};

module.exports = { orchestratePrescriptionScan };
