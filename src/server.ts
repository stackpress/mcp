//modules
import { 
  McpServer
} from '@modelcontextprotocol/sdk/server/mcp.js';
import { 
  StdioServerTransport 
} from '@modelcontextprotocol/sdk/server/stdio.js';
//src
import type { Query, Task } from './types';
import { build } from './config';
import Store from './store';
import { embed, getPackageInfo, getContextPack } from './helpers';

export const pack = getContextPack();
export const project = getPackageInfo();
export const store = new Store(build);

export const search_context = {
  name: 'search_context',
  description: 'Semantic search over Stackpress docs',
  inputSchema: {
    type: 'object',
    properties: {
      query: { type: 'string' },
      repo: { type: 'string' },
      section: { type: 'string' },
      must_only: { type: 'boolean' },
      k: { type: 'number', default: 6 }
    },
    required: ['query']
  },
  async *execute({ query, repo, must_only, k = 6 }: Query) {
    const [q] = await embed([String(query)]);
    const results = store.search(q, {
      repo,
      k,
      mustOnly: !!must_only,
      order: pack.order
    });
    return {
      content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
    };
  }
};

export const get_rule = {
  name: 'get_rule',
  description: 'Fetch a chunk by id',
  inputSchema: { type:'object', properties: { id:{type:'string'} }, required:['id'] },
  async *execute({ id }: { id: string }) {
    const [repo] = String(id).split(':');
    const items = store.read(repo).filter(c => c.id === id);
    return { 
      content: [
        { 
          type:'text', 
          text: items.length ? JSON.stringify(items[0], null, 2) : 'NOT_FOUND' 
        }
      ]
    };
  }
};

export const dependency_graph = {
  name: 'dependency_graph',
  description: 'Returns ordered dependencies',
  inputSchema: { type:'object', properties: { repo:{type:'string'} } },
  async *execute() {
    return { 
      content: [ 
        { 
          type: 'text', 
          text: JSON.stringify({ order: pack.order }, null, 2) 
        }
      ] 
    };
  }
};

export const build_brief = {
  name: 'build_brief',
  description: 'Assemble a compact brief for a task from top results across repos',
  inputSchema: {
    type:'object',
    properties: {
      task: { type:'string' },
      repos: { type:'array', items:{type:'string'} },
      tokens: { type:'number', default: 6000 }
    },
    required:['task','repos']
  },
  async *execute({ task, repos }: Task) {
    const [q] = await embed([String(task)]);
    // Pull top N per repo, prioritize MUST and upstream (lower dependency_rank)
    const perRepo = repos.map(r => ({
      repo: r,
      hits: store.search(q, { repo: r, k: 8, mustOnly: false })
        .sort((a,b) => {
          const aw = (a.rule_level === 'MUST' ? 2 : a.rule_level === 'SHOULD' ? 1.2 : 1);
          const bw = (b.rule_level === 'MUST' ? 2 : b.rule_level === 'SHOULD' ? 1.2 : 1);
          return (bw - aw); // MUST first
        })
        .slice(0, 8)
    }));

    const brief = [
      `# Stackpress Task Brief`,
      `Task: ${task}`,
      ``,
      `**Rules precedence:** MUST > SHOULD > MUST NOT. Upstream (lib) overrides downstream on conflict.`,
      ``
    ];
    for (const { repo, hits } of perRepo) {
      brief.push(`## ${repo}`);
      for (const h of hits) {
        brief.push(`### ${h.headings.join(' › ')}`);
        if (h.rule_level) brief.push(`**${h.rule_level}**`);
        brief.push(h.text);
        brief.push('');
      }
    }
    // (Optional) truncate to token budget here if you wire a tokenizer.

    return { content: [{ type:'text', text: brief.join('\n') }] };
  }
};

export default async function serve() {
  const server = new McpServer({
    name: project.name,
    version: project.version,
    tools: [ search_context, get_rule, dependency_graph, build_brief ]
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
};
