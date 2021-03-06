'use strict';

const spawn = require('child_process').spawn;
const EventEmitter = require('events');

function kutaAsEmitter(processArgs) {
  const process = spawn('./bin/cli.js', processArgs);
  let processClosed = false;
  let failures;
  let passes;
  let dataRead = '';
  let fullData = '';
  const testCompletedEmitter = new EventEmitter();

  process.stdout.on('data', (data) => {
    dataRead += data.toString();
    fullData += data.toString();
    const matches = dataRead.match(/Passed: (\d+)\nFailed: (\d+)/);
    if (matches && matches.length === 3) {
      dataRead = '';
      passes = parseInt(matches[1], 10);
      failures = parseInt(matches[2], 10);
      testCompletedEmitter.emit('completed');
    }
  });

  process.on('close', () => {
    processClosed = true;
  });

  return {
    waitForCompletedRun() {
      return new Promise((resolve) => {
        testCompletedEmitter.on('completed', resolve);
      });
    },
    failures() {
      return failures;
    },
    passes() {
      return passes;
    },
    isClosed() {
      return processClosed;
    },
    data() {
      return fullData;
    },
    kill() {
      process.kill();
    }
  };
}

module.exports = {
  kutaAsEmitter
};
