const yup = require("yup");

async function userValidator(req, resp, next) {
    const { body } = req

    const userMetadataScheme = yup.object ({
        username: yup.string().required().min(5),
        email: yup.string().required().email(),
    })

    try {
        const data = await userMetadataScheme.validate(body)
        req.body = data
        next()
    } catch (err) {
        // next(err)
        resp.status(404)
            .send(err.message)
    }
}

async function idValidator(req, resp, next) {
    const { params } = req

    const idMetadataScheme = yup.object ({
        userId: yup.number().required().positive().integer()
    })

    try {
        req.params.userId = await idMetadataScheme.validate(params)
        next()
    } catch (err) {
        // next(err)
        resp.status(404)
            .send(err.message)
    }
}

module.exports ={
    userValidator,
    idValidator
}