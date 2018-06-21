import test from 'ava';
import { noop, now, getStdio } from '../lib/utils';

test.serial('utils#noop', (t) => {
  noop();
  t.pass();
});

test.serial('utils#now', (t) => {
  t.regex(String(now()), /\d{13}/);
  t.regex(now('date'), /\d{4}(-\d\d){2}/);
  t.regex(now('datetime'), /\d{4}(-\d\d){2} \d\d(:\d\d){2}/);
});

test.serial('utils#getStdio', (t) => {
  t.is(getStdio('error'), process.stderr);
  t.is(getStdio('fatal'), process.stderr);
  t.is(getStdio('info'), process.stdout);
});
