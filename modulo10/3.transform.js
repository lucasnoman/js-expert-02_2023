import { createWriteStream } from 'fs';
import { Readable, Transform, Writable } from 'stream';

// Fonte de dados
const readable = Readable({
  read() {
    // "for" é lento. Tem forma mais rápida de fazer
    for (let index = 0; index < 1e4; index++) {
      const person = { id: Date.now() + index, name: `Lucas-${index}` };
      const data = JSON.stringify(person);
      this.push(data);
    }

    // Informa que os dados acabaram
    this.push(null);
  },
});

// Processamento dos dados
const mapFields = Transform({
  transform(chunk, encoding, cb) {
    const data = JSON.parse(chunk);
    const result = `${data.id}, ${data.name.toUpperCase()}\n`;
    cb(null, result);
  },
});

// Adiciona cabeçalho para os dados
const mapHeaders = Transform({
  transform(chunk, encoding, cb) {
    this.counter = this.counter ?? 0;
    if (this.counter) return cb(null, chunk);

    this.counter += 1;
    cb(null, 'id, name\n'.concat(chunk));
  },
});

// Saída de dados
const writable = Writable({
  write(chunk, encoding, cb) {
    console.log('msg', chunk.toString());
    // createWriteStream('my.csv').write(chunk)
    cb();
  },
});

// Começa a receber os dados
const pipeline = readable
  // Mapeia os arquivos
  .pipe(mapFields)
  // Se tiver item, adiciona um header
  .pipe(mapHeaders)
  // writable é sempre a saída -> imprimir, salvar ou ignorar
  .pipe(createWriteStream('my.csv'));
// .pipe(process.stdout);
// .pipe(writable);

// Esses "pipe(...)" é um encadeamento de funções como em:
// ls | grep package | xargs cat | jq .name

pipeline.on('end', () => console.log('acabou!'));
