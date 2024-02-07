const logger = require("./utils/logger")('main')
const fs = require("fs")
const promise = require("fs/promises")
const path = require("path")

const start = async () => {
    const source = await promise.readdir('./source')
    const target = await promise.readdir("./target")

    const transfer = async (catalogue, receiver, universalPath) =>
        catalogue.map(async element => {
            const isDir = await promise.stat(`./source/${universalPath}${element}`).then(res => res.isDirectory())

            // не работает без then
            // const isDir = await promise.stat(`${sourcePath}${element}`).isDirectory()

            // работает без then
            // const file = await promise.stat(`${sourcePath}${element}`)
            // const isDir = file.isDirectory()
            // console.log(isDir)

            if (isDir) {
                if (!receiver.includes(element)) {
                    fs.mkdir(`./target/${universalPath}${element}`, (err, res) => {
                        logger.info(`Creating directory: ${universalPath}${element}`)
                    })
                }
                else logger.warn(`Entering existing directory: ${universalPath}${element}`)

                const originalDir = await promise.readdir(`./source/${universalPath}/${element}`)
                const receiverDir = await promise.readdir(`./target/${universalPath}/${element}`)

                const newPath = `${universalPath}${element}/`

                await transfer(originalDir, receiverDir, newPath)
            }
            else if (!receiver.includes(element) && !isDir) {
                fs.copyFile(`./source/${universalPath}/${element}`, `./target/${universalPath}/${element}`, (err, res) => {
                    logger.info(`Creating file: ${universalPath}${element}`)
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