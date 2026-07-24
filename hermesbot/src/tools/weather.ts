export const weatherTool = {
  name: "weather",
  description: "Get current weather for a city. Use this when the user asks about weather.",
  inputSchema: {
    type: "object",
    properties: {
      city: { type: "string", description: "City name" },
    },
    required: ["city"],
  },
  async execute(input: { city: string }): Promise<any> {
    return {
      tool: "weather",
      result: `Weather for ${input.city}: Add a weather API (e.g. Open-Meteo) here.`,
    };
  },
};
