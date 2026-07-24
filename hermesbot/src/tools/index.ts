export interface Tool {
  name: string;
  description: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
  execute(input: any): Promise<any>;
}

export function getTools(env: any): Tool[] {
  return [];
}
