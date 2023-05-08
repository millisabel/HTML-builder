const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const stylesDir = path.join(__dirname, 'styles');
const assetsDir = path.join(__dirname, 'assets');

const projectDistDir = path.join(__dirname, 'project-dist');
const stylePath = path.join(projectDistDir, 'style.css');
const indexPath = path.join(projectDistDir, 'index.html');
const distAssetsDir = path.join(projectDistDir, 'assets');

fs.mkdir(projectDistDir, { recursive: true }, err => {
  if (err) {
    console.error(err);
  } else {
    console.log('project-dist directory created!');
  }
});

fs.readFile(templatePath, 'utf8', (err, template) => {
  if (err) {
    console.error(err);
    return;
  }

  const tags = template.match(/{{\w+}}/g);

  if (!tags) {
    console.log('No template tags found!');
    return;
  }

  const components = tags.map(tag => {
    const componentName = tag.slice(2, -2);
    const componentPath = path.join(componentsDir, `${componentName}.html`);

    return fs.promises.readFile(componentPath, 'utf8')
      .then(component => {
        return {
          tag: tag,
          component: component
        };
      })
      .catch(err => {
        console.error(`Error reading component file "${componentPath}":`, err);
        return null;
      });
  });

  Promise.all(components).then(results => {
    results.forEach(result => {
      if (result) {
        template = template.replace(result.tag, result.component);
      }
    });

    fs.writeFile(indexPath, template, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('index.html created!');
      }
    });
  });
});

fs.readdir(stylesDir, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  const cssFiles = files.filter(file => path.extname(file) === '.css');

  const styles = cssFiles.map(file => {
    const filePath = path.join(stylesDir, file);
    return fs.promises.readFile(filePath, 'utf8');
  });

  Promise.all(styles).then(results => {
    const style = results.join('\n');
    fs.writeFile(stylePath, style, err => {
      if (err) {
        console.error(err);
      } else {
        console.log('style.css created!');
      }
    });
  });
});

async function copyAssets() {
  await fs.mkdir(distAssetsDir, { recursive: true }, (err) => {
    if (err) throw err;
  });
  const files = await fs.promises.readdir(assetsDir);

  for (const file of files) {
    const sourcePath = path.join(assetsDir, file);
    const targetPath = path.join(distAssetsDir, file);
    const stat = await fs.promises.stat(sourcePath);

    if (stat.isFile()) {
      await fs.promises.copyFile(sourcePath, targetPath);
    } else if (stat.isDirectory()) {
      await copyFolder(sourcePath, targetPath);
    }
  }
  console.log('Assets copied successfully');
}

async function copyFolder(source, target) {
  await fs.promises.mkdir(target, { recursive: true });
  const files = await fs.promises.readdir(source);
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);
    const stat = await fs.promises.stat(sourcePath);
    if (stat.isFile()) {
      await fs.promises.copyFile(sourcePath, targetPath);
    } else if (stat.isDirectory()) {
      await copyFolder(sourcePath, targetPath);
    }
  }
}

copyAssets().catch(console.error);