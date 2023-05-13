import { Duplex, Transform } from 'stream';

let count = 0;
const server = new Duplex({
  objectMode: true,
  encoding: 'utf-8',
  read() {
    const everySecond = (intervalContext) => {
      if (count++ <= 5) {
        this.push(`My name is Lucas [${count}]`);
        return;
      }
      clearInterval(intervalContext);
      this.push(null);
    };

    setInterval(() => everySecond(this));
  },

  write(chunk, encoding, cb) {
    console.log(`[writable] saving`, chunk);
    cb();
  },
});

// Provar que são canais de comunicação diferentes. "Duplex"
// Write aciona o writable do Duplex
server.write('[duplex] hey this is a writable!\n');

// "on data" -> loga o que aconteceu no ".push" do readable
// server.on('data', (msg) => console.log(`[readable] ${msg}`));

// O push deixa enviar mais dados
server.push('[duplex] hey this is also a readable!\n');

// server.pipe(process.stdout);

const transformToUpperCase = Transform({
  objectMode: true,
  transform(chunk, env, cb) {
    cb(null, chunk.toUpperCase());
  },
});

// transform é também um duplex, mas não possui comunicação independente
transformToUpperCase.write('[transform] hello from write!');

// push vai ignorar o que você tem na função transform
transformToUpperCase.push('[transform] hello from push!\n');

// Redireciona todos os dados de readable para writable do duplex
server.pipe(transformToUpperCase).pipe(server);
