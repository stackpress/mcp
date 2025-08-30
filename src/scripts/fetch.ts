import Store from '../store';

const names = process.argv.slice(2);

Store.fetch(
  names.length ? names : undefined,
  (type, message) => {
    if (type === 'error') {
      console.error(message);
      return;
    }
    console.log(message);
  }
).catch(e => {
  console.error(e);
  process.exit(1);
});
