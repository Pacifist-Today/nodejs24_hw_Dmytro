const logger = require("./utils/logger")('main')
const fs = require("fs")
const promise = require("fs/promises")
const path = require("path")

const start = async () => {
    const source = await promise.readdir('./source')
    const target = await promise.readdir("./target")

    let targetPath = "./target/"
    let sourcePath = "./source/"

    const transfering = async (catalogue, receiver, sourcePath, targetPath) =>
        catalogue.map(async element => {

            const isDir = await promise.stat(`${sourcePath}${element}`).then(res => res.isDirectory())

            // не работает
            // const isDir = await promise.stat(`${sourcePath}${catalogue[i]}`).isDirectory()

            if (isDir) {
                if (!receiver.includes(element)) {
                    fs.mkdir(`${targetPath}${element}`, (err, res) => {
                        logger.info(`Creating directory: ${targetPath}${element}`)
                    })
                }
                else logger.warn(`Entering existing directory: ${targetPath}${element}`)

                const originalDir = await promise.readdir(`${sourcePath}/${element}`)

                const receiverDir = await promise.readdir(`${targetPath}/${element}`)

                const newSourcePath = `${sourcePath}${element}/`
                const newTargetPath = `${targetPath}${element}/`

                await transfering(originalDir, receiverDir, newSourcePath, newTargetPath)
            }
            else if (!receiver.includes(element) && !isDir) {
                fs.writeFile(`${targetPath}${element}`, "", (err, res) => {
                    logger.info(`Creating file: ${targetPath}${element}`)
                })
            }
            else if (receiver.includes(element)) {
                logger.warn(`${element} is already existed`)
            }
    })

    transfering(source, target, sourcePath, targetPath)
}

module.exports = {
    start
}