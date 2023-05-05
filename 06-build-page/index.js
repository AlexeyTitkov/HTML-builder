const fs = require('fs');
const path = require('path');

const componentsFolderPath = path.join(__dirname, 'components');
const templateFilePath = path.join(__dirname, 'template.html');
const projectDistFolderPath = path.join(__dirname, 'project-dist');
const indexFilePath = path.join(projectDistFolderPath, 'index.html');
const stylesFolderPath = path.join(__dirname, 'styles');
const outputFilePath = path.join(projectDistFolderPath, 'style.css');
const assetsSourceDir = path.join(__dirname, 'assets');
const assetsTargetDir = path.join(__dirname, 'project-dist/assets');

const readContent = (filePath) => {
  return fs.promises.readFile(filePath, 'utf-8');
}

const getTagsFromTemplate = (content) => {
  const tagRegExp = /{{(.*?)}}/g;
  const tags = [];
  let match;
  while (match = tagRegExp.exec(content)) {
    tags.push(match[1].trim());
  }
  return tags;
}

const replaceTagsInTemplate = async (content, tags) => {
  let resultContent = content;
  for (const tag of tags) {
    const componentFilePath = path.join(componentsFolderPath, `${tag}.html`);
    const componentContent = await readContent(componentFilePath);
    resultContent = resultContent.replace(`{{${tag}}}`, componentContent);
  }
  return resultContent;
}

const mergeStyles = () => {
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

    fs.writeFile(outputFilePath, cssContent.join(''), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`Стили из папки styles соеденены в файл и помещены в ${outputFilePath}`);
      }
    });
  });
};



async function copyDir(assetsSourceDir, assetsTargetDir) {
  try {
    await fs.promises.access(assetsTargetDir);
  } catch (error) {
    await fs.promises.mkdir(assetsTargetDir, {recursive: true});
  }

  const files = await fs.promises.readdir(assetsSourceDir, {withFileTypes: true});

  for (const file of files) {
    const sourcePath = path.join(assetsSourceDir, file.name);
    const targetPath = path.join(assetsTargetDir, file.name);

    if (file.isDirectory()) {
      await copyDir(sourcePath, targetPath);
    } else {
      await fs.promises.copyFile(sourcePath, targetPath);
    }
  }
}

async function buildPage() {
  try {
    await fs.promises.mkdir(projectDistFolderPath, { recursive: true });
    console.log(`Создана папка ${projectDistFolderPath}`);
  } catch (err) {
    console.error(err);
    return;
  }

  const templateContent = await readContent(templateFilePath);
  const tags = getTagsFromTemplate(templateContent);
  const resultContent = await replaceTagsInTemplate(templateContent, tags);

  fs.writeFile(indexFilePath, resultContent, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`Index-файл создан в ${indexFilePath}`);
    }
  });

  mergeStyles();

  copyDir(assetsSourceDir, assetsTargetDir);
}

buildPage().catch((err) => console.error(err));
