import { Readable, Writable } from 'stream';

// Fonte de dados
const readable = Readable({
  read() {
    this.push('Hello there 1!');
    this.push('Hello there 2!');
    this.push('Hello there 3!');

    // Informa que os dados acabaram
    this.push(null);
  },
});

// Saída de dados
const writable = Writable({
  write(chunk, encoding, cb) {
    console.log('msg', chunk.toString());

    cb();
  },
});

readable
  // writable é sempre a saída -> imprimir, salvar ou ignorar
  .pipe(writable);
