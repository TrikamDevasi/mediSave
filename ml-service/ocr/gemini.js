const { GoogleGenerativeAI } = require('@google/generative-ai');

const scanPrescriptionWithGemini = async (base64Image, mimeType = 'image/jpeg') => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not configured');
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are a medical prescription OCR expert. Analyze this prescription image and extract:
1. All medicine names (brand and/or generic)
2. Dosage/strength for each medicine (e.g., 500mg, 10mg)
3. Frequency (e.g., twice daily, BD, OD)
4. Duration if mentioned

Return ONLY valid JSON in this exact format:
{
  "medicines": [
    {
      "name": "medicine name as written",
      "dosage": "strength",
      "frequency": "frequency",
      "duration": "duration or null",
      "confidence": 0.0-1.0
    }
  ],
  "doctorName": "doctor name or null",
  "date": "prescription date or null",
  "rawText": "full extracted text"
}

If you cannot read the prescription clearly, still try your best and set lower confidence scores.
Return only the JSON, no markdown, no explanation.`;
    
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType
      }
    };
    
    console.time('gemini-ocr');
    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();
    console.timeEnd('gemini-ocr');
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON found in Gemini response');
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.medicines || !Array.isArray(parsed.medicines)) {
      throw new Error('Invalid response format from Gemini');
    }
    
    return parsed;
  } catch (error) {
    console.error('Gemini OCR error:', error.message);
    throw error;
  }
};

module.exports = { scanPrescriptionWithGemini };
