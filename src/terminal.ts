//modules
import { Terminal } from '@stackpress/lib';
//src
import Store from './store';
import server from './server';
import { getContextPack } from './helpers';

/**
 * Returns a terminal interface
 */
export default function terminal(argv = process.argv) {
  const terminal = new Terminal(argv, '[spmcp]');
  const logger = async (type: string, message: string) => {
    terminal.resolve('log', { type, message });
  };

  terminal.on('log', req => {
    const type = req.data.path('type', 'log');
    const message = req.data.path('message', '');
    if (!message) return;
    if (type === 'error') {
      terminal.control.error(message);
    } else if (type === 'success') {
      terminal.control.success(message);
    } else if (type === 'system') {
      terminal.control.system(message);
    } else {
      terminal.control.info(message);
    }
  });

  terminal.on('fetch', async req => {
    const pack = getContextPack();
    const names = pack.include
      //just get the repo names
      .map(item => item.repo)
      //flatten to string[]
      .flat()
      //only include names that are requested
      .filter(name => req.data(name));
    // Fetch the latest data
    await Store.fetch(names, logger);
  });

  terminal.on('verify', async () => {
    // Fetch the latest data
    await Store.verified(logger);
  });

  terminal.on('serve', async () => {
    // Start the MCP server
    await terminal.resolve('log', { 
      type: 'success', 
      message: 'MCP server started!' 
    });
    await server();
  });

  return terminal;
}
