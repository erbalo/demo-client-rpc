import { UserRepresentation } from '../models/users/representations/user.representation';
import { UserRequest } from '../models/users/requests/user.request';

export interface IUserService {
    create(userRequest: UserRequest): Promise<void>;
}
