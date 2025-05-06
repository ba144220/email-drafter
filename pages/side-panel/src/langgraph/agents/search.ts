import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { model } from '../models/openai';
import { searchTool } from '../tools/search';

const agent = createReactAgent({
  llm: model,
  tools: [searchTool],
});

export { agent };
