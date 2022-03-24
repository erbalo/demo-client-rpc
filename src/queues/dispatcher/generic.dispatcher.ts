import 'reflect-metadata';
import { inject, injectable, singleton } from 'tsyringe';
import { v4 as uuid4 } from 'uuid';
import { AmpqRpcConsumer } from 'amqp-rpc-lib';
import { RabbitConnection } from '../../interfaces/rabbit.connection.interface';
import { Logger as LoggerFactory } from '@casai-org/commons';

const Logger = LoggerFactory.getLogger(module);

interface DataResponse<R> {
    status_code: number;
    data: R;
}

export class BadRequestError extends Error {
    constructor(e) {
        super(e);
    }
}

@singleton()
export class GenericDispatcher {
    private rabbitConnection: RabbitConnection;

    constructor(@inject('RabbitConnection') rabbitConnection: RabbitConnection) {
        this.rabbitConnection = rabbitConnection;
    }

    async dispatch<T, R>(request: T, queueName: string): Promise<R> {
        let timeout = 30_000;

        try {
            timeout = parseInt(process.env.GENERIC_QUEUE_TIMEOUT);
        } catch (e) {
            // nothing to do
        }

        const client = new AmpqRpcConsumer(this.rabbitConnection.connection, {
            requestsQueue: queueName,
            timeout: timeout,
        });

        await client.start();

        let data;
        try {
            const response = await client.sendAndReceive(request, {});
            data = response as DataResponse<R>;
        } catch (e) {
            // means a connection error
            Logger.error(e, e.message);
            return null;
        }

        if (data.status_code >= 200 && data.status_code <= 206) {
            return data.data as R;
        }

        if (data.status_code >= 400 && data.status_code <= 410) {
            throw new BadRequestError(data.messages);
        }
    }
}
