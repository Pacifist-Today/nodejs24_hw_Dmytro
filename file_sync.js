const logger = require("./utils/logger")('file_sync')
const fs = require("fs")
const promise = require("fs/promises")
const path = require("path")

const start = async () => {
    const source = await promise.readdir('./source')
    const targets = await promise.readdir("./target")

    const transfer = async (catalogue, receiver, universalPath) =>
        catalogue.map(async element => {
            const sourcePath = path.join(".", "source", universalPath, element)
            const targetPath = path.join(".", "target", universalPath, element)

            const stats = await promise.stat(sourcePath)

            if (stats.isFile()) {
                if (receiver.includes(element)) {
                    logger.warn(`${element} is already existed, skipping`);
                    return;
                }

                await promise.copyFile(sourcePath, targetPath);
                logger.info(`Created file: ${targetPath}`);

                return;
            }

            if (stats.isDirectory()) {
                if (!receiver.includes(element)) {
                    await promise.mkdir(targetPath);
                }

                const originalDir = await promise.readdir(sourcePath);
                const receiverDir = await promise.readdir(targetPath);

                const newPath = `${universalPath}${element}/`;

                await transfer(originalDir, receiverDir, newPath);
            }
        })

    await transfer(source, targets, "")
}

module.exports = {
    start
}