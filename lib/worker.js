const test = require('./kuta');
const common = require('./common');

function startSuite(testFile) {
  test.runTests(testFile)
    .then((tests) => process.send(common.reportResult(testFile, tests)))
    .then(() => process.exit());
}

process.on('message', message => {
  switch(message.type) {
  case common.START_TEST_SUITE: {
    startSuite(message.testFile);
    break;
  }
  default:
    console.log('Child - unknown command', message);
    process.send(common.log('Unknown command'));
  }
});