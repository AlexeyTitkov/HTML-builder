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
  console.log(`Папка files скопирована в ${targetDir}`);
}

const sourceDir = path.join(__dirname, 'files');
const targetDir = path.join(__dirname, 'files-copy');

copyDir(sourceDir, targetDir);