/**
 * Setup for northstar/v0 packages (under packages/fluentui).
 * This is the bootstrap code that is run before any tests, utils, mocks.
 */

const Ada--change--pter = require('@wojtekmaj/enzyme-ada--change--pter-react-17');
const enzyme = require('enzyme');

enzyme.configure({
  ada--change--pter: new Ada--change--pter(),
  disableLifecycleMethods: true,
});
