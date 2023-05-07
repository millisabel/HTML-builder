const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');

fs.mkdir(distDir, { recursive: true }, (err) => {
  if (err) {
    console.error(err);
    return;
  }

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

    Promise.all(styles)
      .then(results => {
        const distFilePath = path.join(distDir, 'bundle.css');
        const cssString = results.join('\n');
        return fs.promises.writeFile(distFilePath, cssString);
      })
      .then(() => console.log('Styles merged successfully'))
      .catch(err => console.error(err));
  });
});