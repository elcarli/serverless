const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const addOrder = async (event) => {

    const { id } = event.pathParameters
    const { details } = JSON.parse(event.body)

    const detailsData = []

    for (const detail of details) {
        const product = await prisma.product.findUnique({ where: { id: Number(detail.productId) } })
        detail.priceOnDate = product.price
        detail.subtotal = detail.priceOnDate * detail.quantity
        detail.product = {
            connect: { id: Number(product.id) }
        }

        // Remove productId
        delete detail.productId

        detailsData.push(detail)
    }

    try {

        const orderCreated = await prisma.order.create({
            data: {
                user: {
                    connect: { id: Number(id) }
                },
                details: {
                    create: detailsData
                }
            }
        })

        const details = await prisma.detail.findMany({
            where: { orderId: orderCreated.id },
            select: {
                product: {
                    select: {
                        name: true
                    }
                },
                priceOnDate: true,
                quantity: true,
                subtotal: true,
            }
        })

        let total = 0
        const detailsResult = details.map(detail => {
            detail.product = detail.product.name
            detail.priceOnDate = Number(detail.priceOnDate)
            detail.subtotal = Number(detail.subtotal)
            
            total += Number(detail.subtotal)

            return detail
        })

        const user = await prisma.user.findUnique({ where: { id: Number(id) } })

        let response = {}
        let status = 200

        if (user.balance >= total) {
            // edit balance
            const userEdited = await prisma.user.update({
                where: { id: Number(id) },
                data: {
                    balance: {
                        decrement: total
                    }
                },
            })

            // edit order status
            await prisma.order.update({
                where: { id: Number(orderCreated.id) },
                data: { isApproved: true },
            })

            response = {
                orderId: orderCreated.id,
                date: orderCreated.createdAt,
                total,
                client: userEdited.name,
                newBalance: Number(userEdited.balance),
                details: detailsResult
            }
        } else {
            status = 400
            response = {
                orderId: orderCreated.id,
                error: `La orden fue guardada con estado "rechazado" porque el usuario no tiene suficiente balance, debe aumentar su balance`,
                userBalance: Number(user.balance),
                total
            }
        }

        return {
            statusCode: status,
            body: JSON.stringify(response)
        }

    } catch (e) {
        console.log(e)

        return {
            statusCode: 500,
            body: JSON.stringify({
                error: e
            })
        }
    }
};

module.exports = {
    addOrder
}