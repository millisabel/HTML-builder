const fs = require('fs').promises;
const path = require('path');

const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const COMPONENTS_DIR = path.join(__dirname, '06-build-page/components');
const STYLES_DIR = path.join(__dirname, '06-build-page/styles');
const ASSETS_DIR = path.join(__dirname, '06-build-page/assets');
const DIST_DIR = path.join(__dirname, '06-build-page/project-dist');

async function buildPage() {
  try {
    await fs.mkdir(DIST_DIR);

    const template = await fs.readFile(TEMPLATE_PATH, 'utf-8');

    const tags = template.match(/{{\w+}}/g);
    if (!tags) {
      throw new Error('Шаблон не содержит тегов');
    }

    let result = template;
    for (const tag of tags) {
      const componentName = tag.slice(2, -2);
      const componentPath = path.join(COMPONENTS_DIR, `${componentName}.html`);
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      result = result.replace(tag, componentContent);
    }

    const indexPath = path.join(DIST_DIR, 'index.html');
    await fs.writeFile(indexPath, result);

    const styles = await fs.readdir(STYLES_DIR);
    const css = await Promise.all(
      styles.map(async (filename) => {
        if (path.extname(filename) === '.css') {
          const filepath = path.join(STYLES_DIR, filename);
          return await fs.readFile(filepath, 'utf-8');
        }
      })
    );
    const cssPath = path.join(DIST_DIR, 'style.css');
    await fs.writeFile(cssPath, css.join('\n'));

    const assetsPath = path.join(DIST_DIR, 'assets');
    await fs.mkdir(assetsPath);
    await copyDirectory(ASSETS_DIR, assetsPath);

    console.log('Страница успешно построена');
  } catch (error) {
    console.error(`Ошибка построения страницы: ${error.message}`);
  }
}

buildPage();





