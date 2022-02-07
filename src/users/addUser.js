const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const addUser = async (event) => {

    const { name, email, balance } = JSON.parse(event.body)

    const newUser = {
        name,
        email,
        balance
    }

    try {
        await prisma.user.create({
            data: newUser
        })
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: e
            })
        }
    }

    const allUsers = await prisma.user.findMany({})

    return {
        statusCode: 200,
        body: JSON.stringify(allUsers)
    }
};

module.exports = {
    addUser
}