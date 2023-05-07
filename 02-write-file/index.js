const readline = require('readline');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');

fs.access(filePath, (err) => {
  if (err) {
    fs.writeFile(filePath, '', (err) => {
      if (err) throw err;
      console.log(`Файл ${filePath} создан`);
    });
  }
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log('Привет! Введите текст или нажмите ctrl + c для выхода.');

rl.on('line', (input) => {
  if (input === 'exit') {
    exit();
  }
  writeStream.write(`${input}\n`);
});

rl.on('SIGINT', () => {
  exit();
});

function exit(){
  console.log('До свидания!');
  rl.close();
  writeStream.end();
  process.exit();
}