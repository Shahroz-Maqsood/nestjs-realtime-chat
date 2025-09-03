import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private users: UsersService, private jwt: JwtService) {}

  async signup(email: string, name: string, password: string) {
    const user = await this.users.create({ email, name, password });
    const token = this.sign(user);
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email, true);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = this.sign(user);
    const safeUser = { ...user.toObject(), password: undefined };
    return { user: safeUser, token };
  }

  private sign(user: any) {
    return this.jwt.sign({
      sub: user._id?.toString?.() ?? user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
  }
}
