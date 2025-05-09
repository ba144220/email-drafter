/**
 * This file defines the tools available to the ReAct agent.
 * Tools are functions that the agent can use to interact with external systems or perform specific tasks.
 */
// import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

import { tool } from "@langchain/core/tools";
import {
  getAllTabsInfo,
  getCurrentTabView,
  getTabById,
} from "./browser_tools.js";
import { z } from "zod";

const searchTool = tool(
  async ({ query }) => {
    if (
      query.toLowerCase().includes("sf") ||
      query.toLowerCase().includes("san francisco")
    ) {
      return "It's 60 degrees and foggy.";
    }
    return "It's 90 degrees and sunny.";
  },
  {
    name: "search",
    description: "Call to surf the web.",
    schema: z.object({
      query: z.string().describe("The query to use in your search."),
    }),
  }
);

export const TOOLS = [
  searchTool,
  getAllTabsInfo,
  getCurrentTabView,
  getTabById,
];
