const OpenAI = require('openai');

const scanPrescriptionWithOpenAI = async (base64Image, mimeType = 'image/jpeg') => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY not configured');
    
    const openai = new OpenAI({ apiKey });
    
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
    
    console.time('openai-ocr');
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` }
            }
          ]
        }
      ],
      max_tokens: 2000
    });
    console.timeEnd('openai-ocr');
    
    const text = response.choices[0].message.content;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No valid JSON found in OpenAI response');
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    if (!parsed.medicines || !Array.isArray(parsed.medicines)) {
      throw new Error('Invalid response format from OpenAI');
    }
    
    return parsed;
  } catch (error) {
    console.error('OpenAI OCR error:', error.message);
    throw error;
  }
};

module.exports = { scanPrescriptionWithOpenAI };
