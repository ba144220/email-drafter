import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({
  model: 'gpt-4o',
  temperature: 0,
  maxTokens: 100,
  apiKey: process.env.CEB_OPENAI_API_KEY,
});

export { model };
