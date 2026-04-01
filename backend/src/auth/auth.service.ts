import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  // ✅ REGISTER
  async register(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: Role.USER, // Explicitly set default
        },
      });
    } catch (error) {
      // Prisma error code for unique constraint violation
      if (error.code === 'P2002') {
        throw new ConflictException('Email sudah terdaftar');
      }
      throw error;
    }
  }

  // ✅ LOGIN
  async login(email: string, password: string) {
    email = email.trim();

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { message: 'User tidak ditemukan' };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return { message: 'Password salah' };
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      name: user.name,
    };
  }

  async validateGoogleUser(details: any) {
    console.log('Validating Google User:', details.email);
    let user = await this.prisma.user.findUnique({
      where: { email: details.email },
    });

    if (!user) {
      console.log('Creating new user from Google profile');
      user = await this.prisma.user.create({
        data: {
          email: details.email,
          name: `${details.firstName} ${details.lastName}`,
          password: '', // Password empty for SSO users
          role: Role.USER, // Default role using Enum
          provider: 'google',
        },
      });
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      role: user.role,
      name: user.name,
    };
  }
}