import { IUser } from '../domain/models/users/user.interface';

export class User implements IUser {
    id: string;
    name: string;
    age: number;
    created_at: Date;
}
