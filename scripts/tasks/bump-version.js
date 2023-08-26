const { exec } = require('child_process');
const package = require('../../package.json');

const version = {
  old: package.version,
  next: null,
};

if (process.env.NEXT_VERSION === null) {
  console.log('NEXT_VERSION could not be `null`.');
  process.exit(1);
}

version.next = process.env.NEXT_VERSION;

const cmd = `sed -i "s/${version.old}/${version.next}/" ./package.json`;

exec(cmd, (error, stdout) => {
  if (error) {
    console.log(error.message);
    process.exit(error.code);
  }
  console.log(stdout);
  process.exit(0);
});
