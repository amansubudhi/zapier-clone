import { PrismaClient } from '@prisma/client'
import { JsonObject } from '@prisma/client/runtime/library'

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare global {
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma: ReturnType<typeof prismaClientSingleton> = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma
export type { JsonObject };

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma