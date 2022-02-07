const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getUsers = async (event) => {

    try {
        const allUsers = await prisma.user.findMany()

        return {
            body: JSON.stringify({ allUsers }),
            statusCode: 200
        }
    } catch (e) {
        return {
            body: JSON.stringify(e),
            statusCode: 500
        }
    }

};

module.exports = {
    getUsers
}