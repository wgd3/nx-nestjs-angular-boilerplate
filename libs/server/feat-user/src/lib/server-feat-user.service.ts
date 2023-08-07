import { Injectable, NotImplementedException } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class ServerFeatUserService {
    constructor(
        private userRepo: Repository<any>,
    ) {}

    findUser() {
        throw new NotImplementedException()
    }

    findUserByEmailOrUsername() {
        throw new NotImplementedException()
    }

    createUser() {
        throw new NotImplementedException()
    }

    getUser() {
        throw new NotImplementedException()
    }

    getUsers() {
        throw new NotImplementedException()
    }
}
