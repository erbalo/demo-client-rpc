import { AmqpRpcProducer } from 'amqp-rpc-lib';
import { container, inject, injectable } from 'tsyringe';
import { UserRequest } from '../domain/models/users/requests/user.request';
import { IUserService } from '../domain/services/user.service.interface';
import { QueueConsumer } from '../interfaces/queue.consumer';
import { RabbitConnection } from '../interfaces/rabbit.connection.interface';
import { Logger as LoggerFactory } from '@casai-org/commons';
import UserService from '../services/user.service';
import { BookRequest } from '../domain/models/users/requests/book.request';
import { BadRequestError } from './dispatcher/generic.dispatcher';

const Logger = LoggerFactory.getLogger(module);

@injectable()
class BookSignUpConsumer implements QueueConsumer {
    private rabbitConnection: RabbitConnection;
    private queue: string;
    private userService: IUserService;

    constructor(@inject('RabbitConnection') rabbitConnection: RabbitConnection, @inject('UserQueue') queue: string) {
        this.rabbitConnection = rabbitConnection;
        this.queue = queue;
        this.userService = container.resolve(UserService);
    }

    async bind(): Promise<void> {
        await this.rabbitConnection.channel.assertQueue(this.queue, {
            deadLetterRoutingKey: this.queue + '.expired',
            deadLetterExchange: this.queue + '.direct',
            messageTtl: 15000,
            durable: true,
        });

        const producer = new AmqpRpcProducer(this.rabbitConnection.connection, {
            requestsQueue: this.queue,
        });

        producer.registerListener(async request => {
            Logger.info('Request to process chido:', JSON.stringify(request));
            let bookRequest: BookRequest = null;
            try {
                bookRequest = request as BookRequest;
            } catch (e) {
                Logger.error(e);
            }

            const { age, name }: UserRequest = bookRequest;
            const userRequest: UserRequest = { age, name };

            try {
                const user = await this.userService.create(userRequest);
                Logger.info(user);
            } catch (e) {
                if (e instanceof BadRequestError) {
                    Logger.warn(`Bad request for queue ${this.queue}`);
                    return {
                        status_code: 400,
                        messages: e.message,
                    };
                }
            }

            return {
                status_code: 200,
                data: null,
            };
        });

        await producer.start();
    }
}

export default BookSignUpConsumer;
