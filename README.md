# toger

> 一个小巧精致的 nodejs 日志模块

  [![Travis](https://img.shields.io/travis/toomeefed/toger.svg)](https://travis-ci.org/toomeefed/toger)
  [![Coverage Status](https://img.shields.io/coveralls/toomeefed/toger/master.svg?style=flat)](https://coveralls.io/github/toomeefed/toger?branch=master)
  [![David](https://img.shields.io/david/toomeefed/toger.svg)](https://david-dm.org/toomeefed/toger)
  [![npm (scoped)](https://img.shields.io/npm/v/toger.svg)](https://www.npmjs.com/package/toger)
  [![node (scoped)](https://img.shields.io/node/v/toger.svg)](https://github.com/toomeefed/toger)
  [![GitHub license](https://img.shields.io/github/license/toomeefed/toger.svg)](https://github.com/toomeefed/toger/blob/master/LICENSE)


## 安装

```sh
$ yarn add toger # 推荐
# 或者
$ npm i -S toger
```

## 使用

```js
import toger from 'toger';
// 或者
// const { toger } = require('toger');

const logger = toger();

logger.trace('你好!'); // [2018-06-01 10:00:00] TRACE 你好!
logger.debug('你好!'); // [2018-06-01 10:00:00] DEBUG 你好!
logger.info('你好!');  // [2018-06-01 10:00:00] INFO 你好!
logger.warn('你好!');  // [2018-06-01 10:00:00] WARN 你好!
logger.error('你好!'); // [2018-06-01 10:00:00] ERROR 你好!
logger.fatal('你好!'); // [2018-06-01 10:00:00] FATAL 你好!
```

这是默认日志级别。  
输入的时候会有智能提示哦。


### 设置日志级别

```js
import toger from 'toger';

const logger = toger({
  level: 'warn',
});

logger.trace('你好!');
logger.debug('你好!');
logger.info('你好!');
logger.warn('你好!');
logger.error('你好!');
logger.fatal('你好!');
```

这样只会输出 warn, error, fatal 三个级别的日志。


### 自定义日志级别

```js
import toger from 'toger';

const logger = toger({
  levels: ['http', 'api', 'mysql', 'redis'],
});

logger.http('http 日志');
logger.api('api 日志');
logger.mysql('mysql 日志');
logger.redis('redis 日志');
```

这样的日志是不是很方便呢。


### 输出到文件

```js
import toger from 'toger';

const logger = toger({
  stream: true,
});

logger.trace('你好!');
logger.debug('你好!');
logger.info('你好!');
logger.warn('你好!');
logger.error('你好!');
logger.fatal('你好!');
```

默认输出到当前目录的 logs 目录下，如果 logs 目录不存在则报错。

```js
const logger = toger({
  stream: {
    dir: 'logs', // 日志目录
    filename: '{level}.log', // 输出的文件名
    cache: 1000, // 开启缓存，每 1s 写入一次。
  },
});
```

这是 stream 参数默认配置。

```js
const { toger } = require('toger');

const logger = toger({
  levels: ['http', 'api', 'mysql', 'redis'],
  stream: ,
});

logger.http('http 日志');
logger.api('api 日志');
logger.mysql('mysql 日志');
logger.redis('redis 日志');
```

当然也可以结合 levels 输出到文件。


## API

### toger(options)

#### options 

| 参数 | 类型 | 可选 | 默认值 | 描述 |
| :-- | :-- | :--: | :-- | :-- |
| level | string | 是 | 'all' | 输出级别，all全部输出，off关闭日志 |
| levels | string[] | 是 | ['trace', 'debug', 'info', 'warn', 'error', 'fatal'] | 日志级别 |
| json | boolean | 是 | false | 输出JSON格式 |
| stamp | boolean | 是 | false | 日期输出为时间戳 |
| stream | boolean/object | 是 | null | 输出到文件，设为 true 使用默认配置 |

#### options.stream 

| 参数 | 类型 | 可选 | 默认值 | 描述 |
| :-- | :-- | :--: | :-- | :-- |
| dir | string | 是 | 'logs' | 日志目录 |
| filename | string | 是 | '{level}.log' | 文件名 |
| cache | number | 是 | 1000 | 缓存刷新时间 0是关闭 |
| mode | number | 是 | 0o666 | linux 文件模式  |


## License

MIT
