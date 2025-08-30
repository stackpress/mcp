//src
import Store from '../src/store';

Store.verified((type, message) => {
  if (type === 'error') {
    console.error(message);
    return;
  }
  console.log(message);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
