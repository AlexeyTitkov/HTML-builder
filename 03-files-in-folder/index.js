const fs = require('fs');
const path = require('path');

const folderPath = './03-files-in-folder/secret-folder';

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        return;
      }

      if (stats.isFile()) {
        const ext = path.extname(file).slice(1);
        const fileSize = stats.size / 1024;
        console.log(`${file}-${ext}-${fileSize.toFixed(3)}kb`);
      }
    });
  });
});