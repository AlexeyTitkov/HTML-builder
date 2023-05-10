const fs = require('fs').promises;
const path = require('path');

async function copyDir(sourceDir, targetDir) {
  try {
    await fs.access(targetDir);
  } catch (error) {
    await fs.mkdir(targetDir, { recursive: true });
  }

  const files = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const file of files) {
    const sourceFile = path.join(sourceDir, file.name);
    const targetFile = path.join(targetDir, file.name);

    if (file.isFile()) {
      await fs.copyFile(sourceFile, targetFile);
    } else if (file.isDirectory()) {
      await copyDir(sourceFile, targetFile);
    }
  }

  const targetFiles = await fs.readdir(targetDir);
  for (const targetFile of targetFiles) {
    const sourceFilePath = path.join(sourceDir, targetFile);
    const targetFilePath = path.join(targetDir, targetFile);
    const sourceFileExists = await fileExists(sourceFilePath);

    if (!sourceFileExists) {
      await fs.unlink(targetFilePath); // Удаление файлов, которых нет в папке files
    }
  }

  console.log(`Папка files скопирована в ${targetDir}`);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, targetDir);
