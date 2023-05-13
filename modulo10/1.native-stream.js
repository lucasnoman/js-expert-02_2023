// ### Comunicação entre terminais
// ### Terminal 1
// node -e "require('net').createServer(socket => socket.pipe(process.stdout)).listen(1338)"

// ### Terminal 2
// node -e "process.stdin.pipe(require('net').connect(1338))"

// ### Gerar arquivo de 1GB
// node -e "process.stdout.write(crypto.randomBytes(1e9))" > big.file

import http from 'http';
import { createReadStream, readFileSync } from 'fs';
http
  .createServer((req, res) => {
    // ### Modelo SÍNCRONO
    // const file = readFileSync('big.file');
    // res.write(file);
    // res.end();

    // Modelo com STREAM
    createReadStream('big.file').pipe(res);
  })
  .listen(3000, () => console.log('running at 3000'));

// ### Executa alguma coisa em cima do big.file
// curl localhost:3000 -o output.txt
