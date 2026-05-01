require('dotenv').config({ path: './.env' });
const { chatWithRAG } = require('./langchain.chain');

async function test() {
  console.log('Testing ChatBot with provider:', process.env.LLM_PROVIDER);
  try {
    const response = await chatWithRAG('Hello, what is paracetamol?');
    console.log('SUCCESS:', response);
  } catch (err) {
    console.error('DIAGNOSTIC ERROR:', err.message);
    if (err.stack) console.error(err.stack);
  }
}

test();
