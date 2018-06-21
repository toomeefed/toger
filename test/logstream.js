import fs from 'fs';
import delay from 'delay';
import rimraf from 'rimraf';
import test from 'ava';

import Logger from '../lib/logger';
import LogStream from '../lib/logstream';

// 创建
test.before(async () => {
  if (!fs.existsSync('./logs')) {
    fs.mkdirSync('./logs');
  }
  await delay(100);
});

// 每次测试后清理
test.afterEach.always.cb((t) => {
  rimraf('./logs/*', () => t.end());
});

// 结束清理
test.after.always.cb((t) => {
  rimraf('./logs', () => t.end());
});

function exists(name) {
  return fs.existsSync(`./logs/${name}.log`);
}

function readFile(name) {
  return fs.readFileSync(`./logs/${name}.log`, 'utf8');
}

test.serial('Logger stream', async (t) => {
  const logger = new Logger({ stamp: true, stream: { cache: 0 } });
  t.plan(logger.options.levels.length * 2);
  for (const name of logger.options.levels) {
    logger[name]('test');
    await delay(100);
    t.true(exists(name));
    t.regex(readFile(name), new RegExp(`^\\[\\d{13}\\] ${name.toUpperCase()} test\\n$`));
  }
});

test.serial('Logger stream level: error', async (t) => {
  const logger = new Logger({ level: 'error', stamp: true, stream: true });
  t.plan(logger.options.levels.length * 2);
  for (const name of logger.options.levels) {
    logger[name]('test');
    await delay(1100);
    if (name === 'error' || name === 'fatal') {
      t.true(exists(name));
      t.regex(readFile(name), new RegExp(`^\\[\\d{13}\\] ${name.toUpperCase()} test\\n$`));
    } else {
      t.false(exists(name));
      t.pass();
    }
  }
});

test.serial('LogStream not exist level', async (t) => {
  const stream = new LogStream({
    level: -1,
    levels: ['info', 'error'],
  });
  stream.write('not exist', { level: 'not exist' });
  stream.close();
  await delay(100);
  t.false(exists('not exist'));
});

test.serial('LogStream flush', async (t) => {
  const stream = new LogStream({
    level: -1,
    levels: ['info', 'error'],
  });
  stream.write('info', { level: 'info' });
  stream.write('', { level: 'error' });
  stream.flush('info');
  stream.flush('error');
  stream.close();
  await delay(100);
  t.true(exists('info') && exists('error'));
  t.regex(readFile('info'), /^info$/);
  t.is(readFile('error'), '');
});

test.serial('LogStream cache: 0', async (t) => {
  const stream = new LogStream({
    level: -1,
    levels: ['info', 'error'],
    cache: 0,
  });
  stream.close();
  await delay(100);
  t.true(exists('info') && exists('error'));
  t.is(readFile('info'), '');
  t.is(readFile('error'), '');
});

test.serial('LogStream write: {}', async (t) => {
  const stream = new LogStream({
    level: -1,
    levels: ['info', 'error'],
    cache: 0,
  });
  stream.write({}, { level: 'info' });
  stream.close();
  await delay(100);
  t.true(exists('info') && exists('error'));
  t.is(readFile('info'), '');
  t.is(readFile('error'), '');
});
