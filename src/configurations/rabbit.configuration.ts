import { injectable } from 'tsyringe';
import amqp, { Connection, Channel } from 'amqplib';
import { RabbitConnection } from '../interfaces/rabbit.connection.interface';

@injectable()
class RabbitConfiguration {
    private connection: Connection;
    private channel: Channel;

    constructor() {
        this.connection = null;
        this.channel = null;
    }

    async init(): Promise<RabbitConfiguration> {
        this.connection = await amqp.connect(process.env.RABBIMQ_URL || 'amqp://localhost');
        this.channel = await this.connection.createChannel();
        return this;
    }

    getConnection(): RabbitConnection {
        return {
            connection: this.connection,
            channel: this.channel,
        };
    }
}

export default RabbitConfiguration;
