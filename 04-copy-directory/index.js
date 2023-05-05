const fs = require('fs').promises;
const path = require('path');

async function copyDir() {
  const sourceDir = path.join(__dirname, 'files');
  const targetDir = path.join(__dirname, 'files-copy');

  try {
    await fs.mkdir(targetDir, { recursive: true });

    const files = await fs.readdir(sourceDir);

    for (const file of files) {
      const sourceFile = path.join(sourceDir, file);
      const targetFile = path.join(targetDir, file);

      const stats = await fs.stat(sourceFile);

      if (stats.isFile()) {
        await fs.copyFile(sourceFile, targetFile);
      }
    }

    console.log('Copying completed!');
  } catch (err) {
    console.error(err);
  }
}

copyDir();
