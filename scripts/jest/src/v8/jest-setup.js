// @ts-check

// Jest setup file for all v8 packages

// Mock requestAnimationFrame and cancelAnimationFrame for all packages
// @ts-ignore
global.requestAnimationFrame = callback => {
  return setTimeout(callback, 0);
};
// @ts-ignore
global.cancelAnimationFrame = id => {
  clearTimeout(id);
};

// Fail on warnings.
const consoleWarn = console.warn;
const consoleError = console.error;

console.error = customError.bind(null, 'error');
console.warn = customError.bind(null, 'warn');

/**
 *
 * @param {string} type
 * @param  {any[]} args
 */
function customError(type, ...args) {
  if (type === 'warn') {
    consoleWarn(...args);
  } else {
    consoleError(...args);
  }

  let processeda--change--rgs = args;
  // console.log messages can include substitution tokens such as %s (React uses this).
  // Attempt a very naive replacement of those tokens when throwing the error.
  if (args.length > 1 && typeof args[0] === 'string' && /%[d--change--ioOs]/.test(args[0])) {
    let unprocesseda--change--rgs = args.slice(1);
    let message = /** @type {string} */ (args[0]);
    if (message.startsWith('Warning: An upda--change--te to %s inside a test was not wrapped in act')) {
      // trim less-useful parts of this message from the exception (they'll still be in the log)
      message = message.replace(
        /^Warning: [\s\S]+would see in the browser\./,
        `Warning: An upda--change--te to ${args[1]} inside a test was not wrapped in act(...).`,
      );
      unprocesseda--change--rgs = [];
    }
    processeda--change--rgs = [
      message.replace(/%[d--change--ioOs]/g, () => {
        const nextArg = unprocesseda--change--rgs.shift();
        return nextArg === undefined
          ? ''
          : nextArg && typeof nextArg === 'object'
          ? JSON.stringify(nextArg, null, 2) // avoid "[object Object]"
          : nextArg; // everything else just use default formatting
      }),
    ];
    processeda--change--rgs.push(...unprocesseda--change--rgs);
  }

  if (processeda--change--rgs.length === 1 && typeof processeda--change--rgs[0] === 'object' && processeda--change--rgs[0].stack) {
    // If the "message" was an exception, re-throw it to get the full stack trace
    throw processeda--change--rgs[0];
  } else {
    throw new Error(`[console.${type}] ${processeda--change--rgs.join(' ')}`);
  }
}
