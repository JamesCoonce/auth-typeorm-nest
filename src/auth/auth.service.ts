import * as jwt from 'jsonwebtoken';
import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { User } from 'src/users/user.entity';
import { UserRO } from 'src/users/users.ro';
import { debug } from 'console';
import { RegistrationStatus } from './interfaces/registrationStatus.interface';
import { CreateUserDto } from 'src/users/users.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  private readonly logger = new Logger(AuthService.name);

  async register(user: CreateUserDto) {
    let status: RegistrationStatus = {
      success: true,
      message: 'user register',
    };
    try {
      await this.usersService.register(user);
    } catch (err) {
      //debug(err);
      status = { success: false, message: err };
    }
    return status;
  }
  createToken(user: User) {
    //debug('get the expiration');
    const expiresIn = 3600;
    //debug('sign the token');
    //debug(user);

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
      },
      'Codebrains',
      { expiresIn },
    );
    //debug('return the token');
    //debug(accessToken);
    return {
      expiresIn,
      accessToken,
    };
  }

  async validateUserToken(payload: JwtPayload): Promise<User> {
    return await this.usersService.findById(payload.id);
  }
  async validateUser(email: string, password: string): Promise<UserRO> {
    const user = await this.usersService.findByEmail(email);
    if (user && user.comparePassword(password)) {
      this.logger.log('password check success');
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
