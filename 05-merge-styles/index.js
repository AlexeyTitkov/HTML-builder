const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolderPath, 'bundle.css');

fs.readdir(stylesFolderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const cssFiles = files.filter((file) => path.extname(file) === '.css');
  const cssContent = [];

  cssFiles.forEach((file, index) => {
    const filePath = path.join(stylesFolderPath, file);
    fs.readFile(filePath, 'utf-8', (err, content) => {
      if (err) {
        console.error(err);
        return;
      }

      cssContent[index] = content;
      if (index === cssFiles.length - 1) {
        fs.writeFile(outputFile, cssContent.join(''), (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('Стили соединены в bundle.css');
        });
      }
    });
  });
});