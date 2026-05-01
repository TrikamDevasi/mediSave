const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { ChatOpenAI } = require('@langchain/openai');
const { ChatGroq } = require('@langchain/groq');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { StringOutputParser } = require('@langchain/core/output_parsers');
const { RunnablePassthrough, RunnableSequence } = require('@langchain/core/runnables');

const SYSTEM_PROMPT = `You are MediBot, a helpful medical assistant for MediSave app in India.
Use the following context to answer questions about medicines, side effects, and drug interactions.
Always recommend consulting a doctor for medical decisions.
Mention Jan Aushadhi generic alternatives when relevant to save costs.
If unsure, say "Please consult your doctor."
Keep answers simple and in clear language.

Context: {context}`;

const prompt = ChatPromptTemplate.fromMessages([
  ['system', SYSTEM_PROMPT],
  ['human', '{input}']
]);

let chainInstance = null;

const formatDocs = (docs) => {
  if (!docs || docs.length === 0) return "No specific medical context available.";
  return docs.map((doc) => doc.pageContent).join("\n\n");
};

async function getChain() {
  if (chainInstance) return chainInstance;
  
  const provider = process.env.LLM_PROVIDER || 'gemini';
  let llm;

  if (provider === 'groq') {
    llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.2,
    });
  } else if (provider === 'openai') {
    llm = new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      temperature: 0.2,
    });
  } else {
    llm = new ChatGoogleGenerativeAI({
      model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
      temperature: 0.2,
      apiKey: process.env.GEMINI_API_KEY
    });
  }

  let retriever = null;
  try {
    const { getVectorStore } = require('./vectorStore');
    const vectorStore = await getVectorStore();
    retriever = vectorStore.asRetriever({ k: 4 });
  } catch (err) {
    console.warn('⚠️ Vector store not available:', err.message);
  }

  // Create a resilient context step
  const contextStep = async (input) => {
    if (!retriever) return "No medical database available.";
    try {
      const docs = await retriever.invoke(input);
      return formatDocs(docs);
    } catch (e) {
      console.warn("⚠️ Context retrieval failed, continuing without RAG:", e.message);
      return "No additional context available.";
    }
  };

  chainInstance = RunnableSequence.from([
    {
      context: contextStep,
      input: new RunnablePassthrough(),
    },
    prompt,
    llm,
    new StringOutputParser(),
  ]);

  return chainInstance;
}

async function chatWithRAG(question, sessionId) {
  try {
    const c = await getChain();
    const answer = await c.invoke(question);
    return { answer, sources: [] };
  } catch (err) {
    console.error('❌ Chat execution error:', err.message);
    return { answer: "I'm having some trouble. Please consult your doctor.", sources: [] };
  }
}

module.exports = { chatWithRAG };
