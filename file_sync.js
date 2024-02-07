const fs = require("fs")
const promise = require("fs/promises")
const path = require("path")

const logger = require("./utils/logger")('file sync')

const start = async () => {
    const source = await promise.readdir('./source')
    const target = await promise.readdir("./target")

    const transfer = async (catalogue, receiver, universalPath) =>
        catalogue.map(async element => {
            const sourcePath = path.join(".", "source", universalPath, element)
            const targetPath = path.join(".", "target", universalPath, element)

            const isDir = await promise.stat(sourcePath).then(res => res.isDirectory())

            // не работает без then
            // const isDir = await promise.stat(`${sourcePath}${element}`).isDirectory()

            // работает без then
            // const file = await promise.stat(`${sourcePath}${element}`)
            // const isDir = file.isDirectory()
            // console.log(isDir)

            if (isDir) {
                if (!receiver.includes(element)) {
                    fs.mkdir(targetPath, (err, res) => {
                        logger.info(`Creating directory: ${targetPath}`)
                    })
                }
                else logger.warn(`Entering existing directory: ${targetPath}`)

                const originalDir = await promise.readdir(sourcePath)
                const receiverDir = await promise.readdir(targetPath)

                const newPath = `${universalPath}${element}/`

                await transfer(originalDir, receiverDir, newPath)
            }
            else if (!receiver.includes(element) && !isDir) {
                fs.copyFile(sourcePath, targetPath, (err, res) => {
                    logger.info(`Creating file: ${targetPath}`)
                })
            }
            else if (receiver.includes(element)) {
                logger.warn(`${element} is already existed`)
            }
        })

    transfer(source, target, "")}

module.exports = {
    start
}