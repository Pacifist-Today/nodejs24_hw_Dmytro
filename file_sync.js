const fsAsync = require('fs/promises');
const path = require('path');

const logger = require('./utils/logger')('file sync');

const start = async () => {
  const sourceItems = await fsAsync.readdir('./source');
  const targetItems = await fsAsync.readdir('./target');

  const transfer = async (origins, targets, universalPath) =>
    origins.map(async (element) => {
      const sourcePath = path.join('.', 'source', universalPath, element);
      const targetPath = path.join('.', 'target', universalPath, element);

      const stats = await fsAsync.stat(sourcePath);

      // не работает без then - правильно, бо якщо без круглих скобок, то ти викликаєш
      // метод isDirectory() безпосередньо на промісі, а потрібно на результаті!
      // const isDir = await (promise.stat(`${sourcePath}${element}`)).isDirectory()

      // работает без then
      // const file = await promise.stat(`${sourcePath}${element}`)
      // const isDir = file.isDirectory()
      // console.log(isDir)

      if (stats.isFile()) {
        if (targets.includes(element)) {
          logger.warn(`${element} is already existed, skipping`);
          return;
        }

        // якщо ми тут, це значить що element - файл, і його немає в target
        await fsAsync.copyFile(sourcePath, targetPath);
        logger.info(`Created file: ${targetPath}`);
        return;
      }

      if (stats.isDirectory()) {
        if (!targets.includes(element)) {
          // неіснуючий каталог створюємо
          await fsAsync.mkdir(targetPath);
        }

        const originalDir = await fsAsync.readdir(sourcePath);
        const receiverDir = await fsAsync.readdir(targetPath);

        const newPath = `${universalPath}${element}/`;

        await transfer(originalDir, receiverDir, newPath);
      }
    });

  transfer(sourceItems, targetItems, '');
};

module.exports = {
  start,
};
