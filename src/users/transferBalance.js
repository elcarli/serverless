const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const transferBalance = async (event) => {

    const { sourceUserId, targetUserId } = event.pathParameters
    const { balance } = JSON.parse(event.body)

    try {

        const sourceUser = await prisma.user.findUnique({ where: { id: Number(sourceUserId) } })

        const targetUser = await prisma.user.findUnique({ where: { id: Number(targetUserId) } })

        let response = {}
        let status = 200

        if (sourceUser.balance >= balance) {

            const transactionCreated = await prisma.transaction.create({
                data: {
                    balance: balance,
                    sourceUser: {
                        connect: { id: Number(sourceUserId) }
                    },
                    targetUser: {
                        connect: { id: Number(targetUserId) }
                    }
                }
            })


            // edit balance
            const sourceUserEdited = await prisma.user.update({
                where: { id: Number(sourceUserId) },
                data: {
                    balance: {
                        decrement: balance
                    }
                },
            })

            const targetUserEdited = await prisma.user.update({
                where: { id: Number(targetUserId) },
                data: {
                    balance: {
                        increment: balance
                    }
                },
            })

            response = {
                transactionId: transactionCreated.id,
                date: transactionCreated.createdAt,
                balance,
                sourceUser: sourceUser.name,
                newSourceUserBalance: sourceUserEdited.balance,
                targetUser: targetUser.name,
                newTargetUserBalance: targetUserEdited.balance,
            }
        } else {
            status = 400
            response = {
                error: `El usuario fuente no tiene suficiente balance, debe aumentar su balance para realizar la transacción`,
                sourceUserBalance: Number(sourceUser.balance),
                balance
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
    transferBalance
}