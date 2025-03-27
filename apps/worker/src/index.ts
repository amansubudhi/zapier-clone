require('dotenv').config()

import { Kafka, Partitioners } from "kafkajs";
import client from "@repo/db/client"
import { JsonObject } from "@repo/db/client";  // If Prisma client is re-exported here
import { parse } from "./parser";
import { sendEmail } from "./email";
import { sendSol } from "./solana";

//Add this global variable to packages
const TOPIC_NAME = 'zap-events'

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092']
})

async function main() {
    const consumer = kafka.consumer({ groupId: 'main-worker' })
    await consumer.connect();

    const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
    await producer.connect();

    await consumer.subscribe({ topic: TOPIC_NAME, fromBeginning: true })

    await consumer.run({
        autoCommit: false,
        eachMessage: async ({ topic, partition, message }) => {
            console.log({
                partition,
                offset: message.offset,
                value: message.value?.toString(),
            })

            if (!message.value?.toString()) {
                return;
            }
            const parsedValue = JSON.parse(message.value.toString());
            const zapRunId = parsedValue.zapRunId;
            const stage = parsedValue.stage;

            const zapRunDetails = await client.zapRun.findFirst({
                where: {
                    id: zapRunId
                },
                include: {
                    zap: {
                        include: {
                            actions: {
                                include: {
                                    type: true
                                }
                            }
                        }
                    }
                }
            });
            //send a query to get back the zap id
            //send a query to get back the actions associated to this zap id
            //find the available actions

            const currentAction = zapRunDetails?.zap.actions.find(x => x.sortingOrder === stage);

            if (!currentAction) {
                console.log("Current action not found?");
                return;
            }

            const zapRunMetadata = zapRunDetails?.metadata;


            if (currentAction.type.id === "65d0220b-6fe2-4c4a-8ec0-d845392d9e08") {
                const body = parse((currentAction.metadata as JsonObject)?.body as string, zapRunMetadata);
                const to = parse((currentAction.metadata as JsonObject)?.email as string, zapRunMetadata);
                console.log(`Sending out email to ${to} body is ${body}`)
                await sendEmail(to, body);
            }

            if (currentAction.type.id === "c4ef6456-3c20-45f0-99dd-775b93b83478") {
                const amount = parse((currentAction.metadata as JsonObject)?.amount as string, zapRunMetadata);
                const address = parse((currentAction.metadata as JsonObject)?.address as string, zapRunMetadata);
                console.log(`Sending out SOL of ${amount} to ${address}`)
                await sendSol(address, amount);
            }

            await new Promise(r => setTimeout(r, 500));

            const zapId = message.value?.toString();
            const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1;

            if (lastStage !== stage) {
                await producer.send({
                    topic: TOPIC_NAME,
                    messages: [{
                        value: JSON.stringify({
                            stage: stage + 1,
                            zapRunId
                        })
                    }]
                })
            }

            await consumer.commitOffsets([{
                topic: TOPIC_NAME,
                partition: partition,
                offset: (parseInt(message.offset) + 1).toString()
            }])
        },
    })
}

main()