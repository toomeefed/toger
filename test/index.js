import test from 'ava';
import hook from './helpers/hook';
import toger from '../lib/index';

test.serial('toger', (t) => {
  const logger = toger();
  hook((data, { level }) => {
    t.is(level, 'info');
    t.regex(data, /^\[\d{4}-\d\d-\d\d \d\d:\d\d:\d\d\] INFO test/);
  });
  logger.info('test');
});
