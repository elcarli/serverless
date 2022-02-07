const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getProducts = async (event) => {

    try {
        const allProducts = await prisma.product.findMany()

        return {
            body: JSON.stringify({ allProducts }),
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
    getProducts
}