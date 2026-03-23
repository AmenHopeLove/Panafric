const fs = require('fs');
const archiver = require('archiver');
const output = fs.createWriteStream('deploy.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.pipe(output);

archive.directory('.next/standalone/', false);
archive.directory('.next/static/', '.next/static');
archive.directory('public/', 'public');

archive.finalize();
