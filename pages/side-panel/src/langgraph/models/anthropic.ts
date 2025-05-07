import { ChatAnthropic } from '@langchain/anthropic';

const model = new ChatAnthropic({
  model: 'claude-3-7-sonnet-latest',
  temperature: 0,
  maxTokens: 300,
  apiKey: process.env.CEB_ANTHROPIC_API_KEY,
});

export default model;
