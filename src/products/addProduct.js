const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const addProduct = async (event) => {

    const { name, price } = JSON.parse(event.body)

    const newProduct = {
        name,
        price
    }

    try {
        await prisma.product.create({
            data: newProduct
        })
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: e
            })
        }
    }

    const allProducts = await prisma.product.findMany({})

    return {
        statusCode: 200,
        body: JSON.stringify(allProducts)
    }
};

module.exports = {
    addProduct
}