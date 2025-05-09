import { tool } from "@langchain/core/tools";
import { interrupt } from "@langchain/langgraph";
import { z } from "zod";

export const getAllTabsInfo = tool(
  async () => {
    const response: string = interrupt({
      name: "getAllTabsInfo",
      input: {},
    });
    return response;
  },
  {
    name: "getAllTabsInfo",
    description:
      "Get all tabs' info in the browser. Return a list of tabs with their title, url, and ID",
    schema: z.object({}),
  }
);

export const getCurrentTabView = tool(
  async () => {
    const response: string = interrupt({
      name: "getCurrentTabView",
      input: {},
    });
    return response;
  },
  {
    name: "getCurrentTabView",
    description: "Get the view of the current tab in the browser",
    schema: z.object({}),
  }
);

const getTabByIdSchema = z.object({
  tabId: z.number(),
});

export type GetTabByIdInput = z.infer<typeof getTabByIdSchema>;

export const getTabById = tool(
  async (input: GetTabByIdInput) => {
    const response: string = interrupt({
      name: "getTabById",
      input: input,
    });
    return response;
  },
  {
    name: "getTabsById",
    description: "Get a view of a tab by ID (from getAllTabs).",
    schema: getTabByIdSchema,
  }
);

export type InterruptValue =
  | {
      name: "getTabById";
      input: GetTabByIdInput;
    }
  | {
      name: "getCurrentTabView";
      input: {};
    }
  | {
      name: "getAllTabsInfo";
      input: {};
    };
