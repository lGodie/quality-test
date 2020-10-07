import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../users/users.entity';

@Injectable()
export class AuthService {
  private usersRepository = getRepository(User);

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.username'])
      .addSelect('user.password')
      .getOne();
    if (user) {
      const match = await bcrypt.compare(pass, user.password);
      if (match) {
        const { password, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async login(user: any): Promise<any> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
      }),
    };
  }
}
