const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const targetDir = path.join(__dirname, 'files-copy');

  try {
    await fs.access(targetDir);
  } catch (error) {
    await fs.mkdir(targetDir, { recursive: true });
  }

  const files = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const sourceFile = path.join(sourceDir, file.name);
      const targetFile = path.join(targetDir, file.name);
      await fs.copyFile(sourceFile, targetFile);
    }
  }
}

copyDir();
