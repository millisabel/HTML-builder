const fs = require('fs/promises');
const path = require('path');

async function readSecretFolder() {
  try {
    const files = await fs.readdir('03-files-in-folder/secret-folder', { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const name = path.parse(file.name).name;
        const ext = path.parse(file.name).ext;
        const stats = await fs.stat(`03-files-in-folder/secret-folder/${file.name}`);
        const size = stats.size / 1024;
        console.log(`${name}-${ext}-${size.toFixed(3)}kb`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

readSecretFolder();