import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { pick } from 'src/utils/object';
import { User } from '@qiqiao/dao';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<Pick<User, 'id' | 'username'> | null> {
    const user = await this.userService.findOneWithPass(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return pick(user, ['id', 'username']);
    }
    return null;
  }

  async initAdmin(username: string, pass: string): Promise<any> {
    const list = await this.userService.list();
    if (list.length) {
      throw new Error('已完成管理用户的初始化，请使用管理用户登录');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pass, salt);
    return this.userService.createUser({ username, password: hashedPassword });
  }

  async login(user: { username: string; password: string }) {
    const validated = await this.validateUser(user.username, user.password);
    if (!validated) {
      throw new Error('账户密码错误');
    }
    const payload = { sub: validated.id, username: validated.username };
    const accessToken = await this.jwtService.signAsync(payload);
    return { access_token: accessToken };
  }
}
