const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');

fs.mkdirSync(distDir, { recursive: true });

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

  const distFilePath = path.join(distDir, 'bundle.css');
  fs.promises.writeFile(distFilePath, styles.join('\n'))
    .then(() => console.log('Styles merged successfully'))
    .catch(err => console.error(err));
});