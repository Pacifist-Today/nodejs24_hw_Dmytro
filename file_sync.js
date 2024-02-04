const logger = require("./utils/logger")('main')
const fs = require("fs")
const promise = require("fs/promises")

const start = async () => {

    const source = await promise.readdir('./source').then((result) => {
        return result
    })

    const target = await promise.readdir("./target").then((result) => {
        return result
    })

    let targetPath = "./target/"
    let sourcePath = "./source/"

    const transfering = async (catalogue, receiver, sourcePath, targetPath) => await catalogue.map(async (el, i) => {
        const isDir = await promise.stat(`${sourcePath}${catalogue[i]}`).then(res => res.isDirectory())

        if (isDir) {
            if (!receiver.includes(catalogue[i])) {
                fs.mkdir(`${targetPath}${catalogue[i]}`, (err, res) => {
                    logger.info(`Creating directory, ${targetPath}${catalogue[i]}`)
                })
            }
            else logger.warn(`Entering existing directory, ${targetPath}${catalogue[i]}`)

            const originalDir = await promise.readdir(`${sourcePath}/${catalogue[i]}`).then((result) => {
                return result
            })

            const receiverDir = await promise.readdir(`${targetPath}/${catalogue[i]}`).then((result) => {
                return result
            })

            const newSourcePath = `${sourcePath}${catalogue[i]}/`
            const newTargetPath = `${targetPath}${catalogue[i]}/`

            await transfering(originalDir, receiverDir, newSourcePath, newTargetPath)
        }
        else if (!receiver.includes(catalogue[i]) && !isDir) {
            fs.writeFile(`${targetPath}${catalogue[i]}`, "", (err, res) => {
                logger.info(`Creating file, ${targetPath}${catalogue[i]}`, isDir, catalogue[i])
            })
        }
        else if (receiver.includes(catalogue[i])) {
            logger.warn(`${catalogue[i]} is already existed`)
        }
    })

    transfering(source, target, sourcePath, targetPath)
}

module.exports = {
    start
}