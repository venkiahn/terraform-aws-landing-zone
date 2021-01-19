'use strict';

const Helper = require('./helper');
const { ROOT_PATH: rootPath, COMPONENTS: components, OUTPUT_PATH: outputPath } = process.env;

/**
 * Check if required env variables are defined
 */
function checkEnvironmentVars() {
  if (!rootPath) {
    throw Error('ERROR: ROOT_PATH variable is empty. Aborting...');
  }

  if (!components) {
    throw Error('ERROR: COMPONENTS variable is empty. Aborting...');
  }

  if (!outputPath) {
    throw Error('ERROR: OUTPUT_PATH variable is empty. Aborting...');
  }
}

/**
 * Execute
 * @return {String}
 */
function main() {
  const processes = [];
  const include = [];
  const jsonComponents = JSON.parse(components);

  Object.keys(jsonComponents).forEach(key => include.push(key));

  if (include.length > 0) {
    processes.push(['build', '--include', include.join(',')]);
    processes.push(['init', '--include', include.join(',')]);
    processes.push(['apply', '--auto-approve', '--dependency', 'ignore', '--include', include.join(',')]);
  }

  try {
    Helper.executeWithErrors(rootPath, 'terrahub', processes);
  } catch (error) {
    throw error;
  }

  return Helper.output(include);
}

(async () => {
  try {
    checkEnvironmentVars();
    Helper.isTerrahubAvailable();

    console.log(main());
  } catch (error) {
    console.log(error);
  }
})();
