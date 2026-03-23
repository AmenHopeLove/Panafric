import { Client } from 'ssh2';

const conn = new Client();
conn.on('ready', () => {
  console.log('SSH Connection Successful!');
  conn.exec('pwd && ls -la', (err, stream) => {
    if (err) throw err;
    stream.on('close', () => {
      conn.end();
    }).on('data', (data) => {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', (data) => {
      console.error('STDERR: ' + data);
    });
  });
}).on('error', (err) => {
  console.error("SSH Error:", err.message);
}).connect({
  host: 'drh4.hostwhitelabel.com',
  port: 22,
  username: 'panafge',
  password: 'Ctu29ltk0@9!;;3U(5K'
});
