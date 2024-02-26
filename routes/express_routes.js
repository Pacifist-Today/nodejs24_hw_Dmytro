const router = require("express").Router()
const fs = require("fs")
const { idValidator, userValidator } = require("./validators")

const FILE_PATH = "./data/users.json"

const users = []

try {
    const userData = fs.readFileSync(FILE_PATH, 'utf8');
    users.push(JSON.parse(userData))
} catch (err) {
    console.error("File doesn't exist", err)
}

router.post('/', userValidator, (req, resp) => {
    const { username, email } = req.body;
    const user = { id:  users.length + 1, username, email };

    users.push(user);

    resp.status(200)
        .json(user);
});

router.get('/', (req, resp) => {
    if (users.length === 0) {
        resp
            .status(500)
            .json({error: "Empty base"})
    }

    resp.status(200)
        .json(users);
});

router.get('/:userId', idValidator, (req, resp) => {
    const { userId } = req.params.userId

    const user = users.find((el) => el.id === userId);

    if (!user) {
        return resp
            .status(404)
            .json({ error: 'User not found' });
    }
    resp.status(200)
        .json(user);
});

router.delete("/:userId", idValidator, (req, resp) => {
    const { userId } = req.params.userId

    if (users.length === 0) {
        return resp
            .status(500)
            .json({error: "Empty base"})
    }

    const user = users.findIndex(el => el.id === userId)

    if (user === -1) {
        return resp
            .status(404)
            .json({error: "User not found"})
    }

    const removedUser = users.splice(user, 1)

    resp.status(200)
        .json(removedUser)
})

process.on('beforeExit', () => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(users), 'utf8');
    console.log('data saved in file:', users);
});

module.exports = {
    router
}