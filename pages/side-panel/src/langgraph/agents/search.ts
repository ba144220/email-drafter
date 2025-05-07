import { createReactAgent } from '@langchain/langgraph/prebuilt';
// import openaiModel from '../models/openai';
import anthropicModel from '../models/anthropic';
import { searchTool } from '../tools/search';

const agent = createReactAgent({
  llm: anthropicModel,
  tools: [searchTool],
});

export { agent };
