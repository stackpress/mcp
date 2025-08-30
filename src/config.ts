//node
import path from 'node:path';

//Used for building the context:

//current working directory
export const cwd = path.dirname(__dirname);
//embedding model
export const model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
//workspace where all the project repos are located
export const workspace = process.env.WORKSPACE_DIR || '';
//where to put build artifacts
export const build = path.join(cwd, process.env.BUILD_DIR || '.build');

//Used for releasing and fetching:

//repository url
export const repo = process.env.GITHUB_REPO || 'https://github.com/stackpress/mcp';

//Used for ingesting:

//openai host
export const host = process.env.OPENAI_HOST || 'https://api.openai.com/v1';
//openai api key
export const token = process.env.OPENAI_KEY || '';