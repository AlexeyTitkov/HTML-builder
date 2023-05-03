const fs = require('fs');
const path = require('path');

const writeStream = fs.createWriteStream(path.join(__dirname, 'output.txt'), { flags: 'a' });

console.log('Введите текст для записи в файл или введите "exit" для завершения процесса.');

process.stdin.on('data', data => {
  const input = data.toString().trim();

  if (input === 'exit') {
    console.log('Процесс завершён.');
    process.exit();
  }

  writeStream.write(`${input}\n`);

  console.log('Текст успешно записан в файл.');

  console.log('Введите текст для записи в файл или введите "exit" для завершения процесса.');
});

process.on('SIGINT', () => {
  console.log('Процесс завершён.');
  process.exit();
});