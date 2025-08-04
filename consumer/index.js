const { Kafka } = require('kafkajs');
const log4js = require('log4js');

const kafka = new Kafka({
  clientId: 'cdc-consumer',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'cdc-group' });

const logger = log4js.getLogger();
logger.level = 'info';

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'tidb_cdc', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const logEntry = {
        timestamp: new Date().toISOString(),
        topic,
        partition,
        offset: message.offset,
        key: message.key?.toString(),
        value: message.value?.toString(),
      };
      logger.info(JSON.stringify(logEntry));
    },
  });
}

run().catch(console.error);

