import { UserRequest } from '../models/users/requests/user.request';
import { IUser } from '../models/users/user.interface';

export interface IUserRepository {
    save(userRequest: UserRequest): Promise<IUser>;
}
