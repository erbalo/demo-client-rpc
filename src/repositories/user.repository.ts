import { UserRequest } from '../domain/models/users/requests/user.request';
import { IUserRepository } from '../domain/repositories/user.repository.interface';
import { User } from '../entities/user';
import { v4 as uuidv4 } from 'uuid';

class UserRepository implements IUserRepository {
    save(userRequest: UserRequest): Promise<User> {
        const user: User = {
            id: uuidv4(),
            name: userRequest.name,
            age: userRequest.age,
            created_at: new Date(),
        };

        return Promise.resolve(user);
    }
}

export default UserRepository;
