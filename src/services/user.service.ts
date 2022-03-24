import { v4 as uuid4 } from 'uuid';
import { AmpqRpcConsumer } from 'amqp-rpc-lib';
import { inject, injectable } from 'tsyringe';
import { UserRepresentation } from '../domain/models/users/representations/user.representation';
import { UserRequest } from '../domain/models/users/requests/user.request';
import { IUser } from '../domain/models/users/user.interface';
import { IUserRepository } from '../domain/repositories/user.repository.interface';
import { IUserService } from '../domain/services/user.service.interface';
import { RabbitConnection } from '../interfaces/rabbit.connection.interface';
import { GenericDispatcher } from '../queues/dispatcher/generic.dispatcher';
import { UserInterface } from '../interfaces/user.interface';

@injectable()
class UserService implements IUserService {
    private dispatcher: GenericDispatcher;

    constructor(@inject('GenericDispatcher') dispatcher: GenericDispatcher) {
        this.dispatcher = dispatcher;
    }

    async create(userRequest: UserRequest): Promise<void> {
        const response = await this.dispatcher.dispatch<UserRequest, UserInterface>(
            userRequest,
            'com.casai.v1.user.service.create',
        );
        console.log('LOOOOOGEANDO RESPONSE', response);
    }
}

export default UserService;
