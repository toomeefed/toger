import test from 'ava';

import hook from './helpers/hook';
import Logger from '../lib/logger';

test.serial('Logger levels', (t) => {
  const logger = new Logger();
  t.plan(logger.options.levels.length * 2);
  logger.options.levels.forEach((name) => {
    hook((data, { level }) => {
      t.is(level, name);
      t.regex(data, new RegExp(`^\\[\\d{4}-\\d\\d-\\d\\d \\d\\d:\\d\\d:\\d\\d\\] ${name.toUpperCase()} test\\n$`));
    });
    logger[name]('test');
  });
});

test.serial('Logger level: off', (t) => {
  t.plan(1);
  const logger = new Logger({ level: 'off' });
  logger.options.levels.forEach((name) => {
    hook((data, { level }) => {
      t.is(level, name);
      t.regex(data, new RegExp(`^\\[\\d{4}-\\d\\d-\\d\\d \\d\\d:\\d\\d:\\d\\d\\] ${name.toUpperCase()} test\\n$`));
    });
    logger[name]('test');
  });
  t.pass();
});

test.serial('Logger level: info', (t) => {
  t.plan(8);
  const logger = new Logger({ level: 'info' });
  logger.options.levels.forEach((name) => {
    hook((data, { level }) => {
      t.is(level, name);
      t.regex(data, new RegExp(`^\\[\\d{4}-\\d\\d-\\d\\d \\d\\d:\\d\\d:\\d\\d\\] ${name.toUpperCase()} test\\n$`));
    });
    logger[name]('test');
  });
});

test.serial('Logger stamp', (t) => {
  const logger = new Logger({ stamp: true });
  t.plan(logger.options.levels.length * 2);
  logger.options.levels.forEach((name) => {
    hook((data, { level }) => {
      t.is(level, name);
      t.regex(data, new RegExp(`^\\[\\d{13}] ${name.toUpperCase()} test\\n$`));
    });
    logger[name]('test');
  });
});

test.serial('Logger json', (t) => {
  const logger = new Logger({ json: true });
  t.plan(logger.options.levels.length * 2);
  logger.options.levels.forEach((name) => {
    hook((data, { level }) => {
      t.is(level, name);
      t.regex(data, new RegExp(`^\\{"time":"\\d{4}-\\d\\d-\\d\\d \\d\\d:\\d\\d:\\d\\d","level":"${name.toUpperCase()}","message":"test"\\}\n$`));
    });
    logger[name]('test');
  });
});

test.serial('Logger json stamp', (t) => {
  const logger = new Logger({ json: true, stamp: true });
  t.plan(logger.options.levels.length * 2);
  logger.options.levels.forEach((name) => {
    hook((data, { level }) => {
      t.is(level, name);
      t.regex(data, new RegExp(`^\\{"time":\\d{13},"level":"${name.toUpperCase()}","message":"test"\\}\n$`));
    });
    logger[name]('test');
  });
});

test.serial('Logger data stamp', (t) => {
  const logger = new Logger({ stamp: true });
  t.plan(logger.options.levels.length * 2);
  logger.options.levels.forEach((name) => {
    hook((data, { level }) => {
      t.is(level, name);
      t.regex(data, new RegExp(`^\\[\\d{13}\\] ${name.toUpperCase()} test \\{"b":2\\} - \\{"a":1\\}\n$`));
    });
    logger[name]({ a: 1 }, 'test %j', { b: 2 });
  });
});

test.serial('Logger custom stamp', (t) => {
  const logger = new Logger({
    levels: ['aa', 'bb', 'cc', 'dd'],
    stamp: true,
  });
  t.plan(logger.options.levels.length * 2);
  logger.options.levels.forEach((name) => {
    hook((data, { level }) => {
      t.is(level, name);
      t.regex(data, new RegExp(`^\\[\\d{13}\\] ${name.toUpperCase()} test\n$`));
    });
    logger[name]('test');
  });
});
