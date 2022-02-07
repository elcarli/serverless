const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const editUser = async (event) => {

    const { id } = event.pathParameters
    const { name, email, balance } = JSON.parse(event.body)

    const newData = {
        name,
        email,
        balance
    }

    try {
        const user = await prisma.user.update({
            where: {
                id: Number(id)
            },
            data: newData
        })

        console.log(user)

        return {
            statusCode: 200,
            body: JSON.stringify(user)
        }

    } catch (e) {
        console.log("ERROR: ", e)
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: e
            })
        }
    }
};

module.exports = {
    editUser
}