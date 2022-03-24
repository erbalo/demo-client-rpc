import { container } from 'tsyringe';
import RabbitConfiguration from '../../configurations/rabbit.configuration';
import { IUserRepository } from '../../domain/repositories/user.repository.interface';
import BookSignUpConsumer from '../../queues/book.signup.queue.consumer';
import { GenericDispatcher } from '../../queues/dispatcher/generic.dispatcher';
import UserRepository from '../../repositories/user.repository';

export const rabbitIoC = async (): Promise<void> => {
    const configuration = container.resolve(RabbitConfiguration);
    const rabbit = await configuration.init();
    container.register('RabbitConnection', { useValue: rabbit.getConnection() });
    container.registerSingleton<GenericDispatcher>('GenericDispatcher', GenericDispatcher);
};

export const queueNamesIoC = () => {
    container.register('UserQueue', { useValue: 'com.casai.v1.library.sigunp' });
};

export const repositoriesIoC = () => {
    container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
};

export const bindQueueConsumersIoC = () => {
    const resolved = container.resolveAll(BookSignUpConsumer);
    resolved.forEach(async consumer => {
        await consumer.bind();
    });
};
