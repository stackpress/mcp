import server from '../src/server';

server().catch(err => {
  console.error(err);
  process.exit(1);
});