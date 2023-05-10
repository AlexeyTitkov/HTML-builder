const fs = require('fs');
const path = require('path');

const stylesFolderPath = path.join(__dirname, 'styles');
const outputFolderPath = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolderPath, 'bundle.css');

fs.readdir(stylesFolderPath, async (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  const cssContent = await Promise.all(cssFiles.map(async (file) => {
    const filePath = path.join(stylesFolderPath, file);
    const fileContent = await fs.promises.readFile(filePath, 'utf-8');
    return fileContent;
  }));

  fs.writeFile(outputFile, cssContent.join(''), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Стили из папки styles соеденены в файл и помещены в ${outputFile}`);
    }
  });
});
