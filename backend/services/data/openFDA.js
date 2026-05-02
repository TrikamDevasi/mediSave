const axios = require('axios');
const { redisClient } = require('../../config/redis');

const searchOpenFDA = async (genericName) => {
  const cacheKey = `fda:${genericName.toLowerCase()}`;
  
  try {
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }
    
    console.time(`fda-search-${genericName}`);
    const response = await axios.get(
      `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${genericName}"&limit=5`,
      { timeout: 10000 }
    );
    console.timeEnd(`fda-search-${genericName}`);
    
    const results = response.data.results || [];
    const extracted = results.map(result => ({
      indications: result.indications_and_usage || [],
      warnings: result.warnings || [],
      sideEffects: result.adverse_reactions || [],
      drugInteractions: result.drug_interactions || []
    }));
    
    if (redisClient) {
      await redisClient.setex(cacheKey, 86400, JSON.stringify(extracted));
    }
    
    return extracted;
  } catch (error) {
    console.error('OpenFDA search error:', error.message);
    return [];
  }
};

const getDrugInfo = async (ndc) => {
  try {
    console.time(`fda-ndc-${ndc}`);
    const response = await axios.get(
      `https://api.fda.gov/drug/ndc.json?search=product_ndc:"${ndc}"`,
      { timeout: 10000 }
    );
    console.timeEnd(`fda-ndc-${ndc}`);
    return response.data.results?.[0] || null;
  } catch (error) {
    console.error('OpenFDA NDC error:', error.message);
    return null;
  }
};

module.exports = { searchOpenFDA, getDrugInfo };
