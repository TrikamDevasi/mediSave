const { HNSWLib } = require('@langchain/community/vectorstores/hnswlib');
const { GoogleGenerativeAIEmbeddings } = require('@langchain/google-genai');
const { OpenAIEmbeddings } = require('@langchain/openai');
const { RecursiveCharacterTextSplitter } = require('@langchain/textsplitters');
const fs = require('fs');
const path = require('path');

const VECTOR_STORE_PATH = path.join(__dirname, '../data/vectorstore');
const DRUG_DATA_PATH = path.join(__dirname, '../data/drug-safety.json');

let vectorStoreInstance = null;

async function initializeVectorStore() {
  if (vectorStoreInstance) return vectorStoreInstance;

  const provider = process.env.EMBEDDING_PROVIDER || 'gemini';
  let embeddings;

  if (provider === 'openai') {
    if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY not configured for embeddings');
    embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.EMBEDDING_MODEL_OPENAI || 'text-embedding-3-small',
    });
  } else {
    if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY not configured for embeddings');
    embeddings = new GoogleGenerativeAIEmbeddings({
      model: process.env.EMBEDDING_MODEL_GEMINI || 'text-embedding-004', // The SDK often handles the models/ prefix automatically
      apiKey: process.env.GEMINI_API_KEY
    });
  }

  // Note: HNSWLib indices are specific to the dimension of the embeddings.
  // If we switch providers, we might need to rebuild the index.
  const indexExists = fs.existsSync(path.join(VECTOR_STORE_PATH, 'hnswlib.index'));
  
  if (indexExists) {
    console.log(`📂 Loading existing vector store (${provider})...`);
    try {
      vectorStoreInstance = await HNSWLib.load(VECTOR_STORE_PATH, embeddings);
      return vectorStoreInstance;
    } catch (err) {
      console.warn('⚠️ Failed to load existing index, possibly due to dimension mismatch. Rebuilding...', err.message);
    }
  }

  console.log('🔨 Building vector store from drug data...');
  
  fs.mkdirSync(VECTOR_STORE_PATH, { recursive: true });

  const drugData = JSON.parse(fs.readFileSync(DRUG_DATA_PATH, 'utf-8'));
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 500, chunkOverlap: 50 });

  const docs = [];
  for (const drug of drugData) {
    const text = `
Medicine: ${drug.medicine}
Category: ${drug.category}
Common Brands: ${drug.commonBrands?.join(', ')}
Side Effects: ${drug.sideEffects?.join(', ')}
Drug Interactions: ${drug.interactions?.join(', ')}
Safety Notes: ${drug.safetyNotes}
Pregnancy Safety: ${drug.pregnancySafety}
Jan Aushadhi Generic: ${drug.janAushadhiGeneric}
Jan Aushadhi Price: ₹${drug.janAushadhiPrice} vs Brand MRP ₹${drug.typicalMRP}
    `.trim();

    const chunks = await splitter.createDocuments([text], [{ medicine: drug.medicine, category: drug.category }]);
    docs.push(...chunks);
  }

  vectorStoreInstance = await HNSWLib.fromDocuments(docs, embeddings);
  await vectorStoreInstance.save(VECTOR_STORE_PATH);
  console.log(`✅ Vector store built with ${docs.length} chunks using ${provider}`);
  return vectorStoreInstance;
}

async function getVectorStore() {
  if (!vectorStoreInstance) {
    vectorStoreInstance = await initializeVectorStore();
  }
  return vectorStoreInstance;
}

module.exports = { getVectorStore, initializeVectorStore };
