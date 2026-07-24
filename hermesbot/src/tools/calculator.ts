export const calculatorTool = {
  name: "calculator",
  description: "Evaluate a math expression. Use this for any arithmetic or calculation.",
  inputSchema: {
    type: "object",
    properties: {
      expression: { type: "string", description: "Math expression, e.g. 2 * (3 + 4)" },
    },
    required: ["expression"],
  },
  async execute(input: { expression: string }): Promise<any> {
    try {
      const result = Function('"use strict"; return (' + input.expression + ')')();
      return { tool: "calculator", result: String(result) };
    } catch (e) {
      return { tool: "calculator", error: (e as Error).message };
    }
  },
};
