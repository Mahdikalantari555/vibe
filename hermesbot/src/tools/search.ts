export const searchTool = {
  name: "search",
  description: "Search the web for information. Use this to find up-to-date facts, news, or any information you don't know.",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "The search query" },
    },
    required: ["query"],
  },
  async execute(input: { query: string }): Promise<any> {
    return {
      tool: "search",
      result: `[search result for: ${input.query}] (Web search requires an external search API — add one here.)`,
    };
  },
};
