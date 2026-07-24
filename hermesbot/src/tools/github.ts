export const githubTool = {
  name: "github",
  description: "Fetch information from GitHub: user profile, repo details, or recent commits.",
  inputSchema: {
    type: "object",
    properties: {
      action: { type: "string", description: "user | repo | commits", enum: ["user", "repo", "commits"] },
      owner: { type: "string", description: "GitHub owner/login" },
      repo: { type: "string", description: "Repository name" },
      path: { type: "string", description: "Commit path for commits action" },
    },
    required: ["action", "owner"],
  },
  async execute(input: any): Promise<any> {
    let url = "";
    if (input.action === "user") {
      url = `https://api.github.com/users/${input.owner}`;
    } else if (input.action === "repo") {
      if (!input.repo) return { tool: "github", error: "repo is required" };
      url = `https://api.github.com/repos/${input.owner}/${input.repo}`;
    } else if (input.action === "commits") {
      if (!input.repo) return { tool: "github", error: "repo is required" };
      url = `https://api.github.com/repos/${input.owner}/${input.repo}/commits${input.path ? `/commits?path=${encodeURIComponent(input.path)}` : ""}`;
    } else {
      return { tool: "github", error: "Unknown action" };
    }

    const r = await fetch(url);
    if (!r.ok) return { tool: "github", error: `HTTP ${r.status}` };
    const data = await r.json();
    return { tool: "github", result: data };
  },
};
