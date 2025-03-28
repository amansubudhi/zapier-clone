import client from "@repo/db/client";
import { Kafka, Partitioners } from "kafkajs";

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

//Add this global variable to packages
const TOPIC_NAME = 'zap-events'

async function main() {
    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
    await producer.connect();

    while (1) {
        const pendingRows = await client.zapRunOutbox.findMany({
            where: {},
            take: 10
        })

        producer.send({
            topic: TOPIC_NAME,
            messages: pendingRows.map(r => {
                return {
                    value: JSON.stringify({ zapRunId: r.zapRunId, stage: 0 })
                }
            })
        })

        await client.zapRunOutbox.deleteMany({
            where: {
                id: {
                    in: pendingRows.map(x => x.id)
                }
            }
        })
    }
}

main();

