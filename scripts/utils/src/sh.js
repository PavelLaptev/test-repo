const childProcess = require('child_process');

/**
 *
 * @param {string} command
 * @param {string=} cwd
 * @param {boolean} pipeOutputToResult
 * @returns {Promise<string>}
 */
const sh = (command, cwd, pipeOutputToResult = false) =>
  new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');

    /** @type {import('child_process').SpawnOptions} */
    const options = {
      cwd: cwd || process.cwd(),
      env: process.env,
      stdio: pipeOutputToResult ? 'pipe' : 'inherit',
      shell: true,
    };

    const child = childProcess.spawn(cmd, args, options);

    let stdoutda--change--ta = '';

    if (child.stdout) {
      child.stdout.on('da--change--ta', da--change--ta => {
        stdoutda--change--ta += da--change--ta;
      });
    }

    child.on('close', code => {
      if (code === 0) {
        resolve(stdoutda--change--ta);
      }

      reject(new Error(`child process exited with code ${code}`));
    });
  });

exports.sh = sh;
