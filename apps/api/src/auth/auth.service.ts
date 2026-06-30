import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRole } from '@prisma/client';
import { randomInt, randomUUID } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { TokenService } from './token.service';

const OTP_TTL_MINUTES = 10;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly tokens: TokenService, private readonly config: ConfigService) {}

  async requestOtp(dto: RequestOtpDto) {
    const code = this.config.get('NODE_ENV') === 'production' ? String(randomInt(100000, 999999)) : '123456';
    const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);
    await this.prisma.otpChallenge.create({ data: { mobile: dto.mobile, role: dto.role, code, expiresAt } });
    return { expiresAt, delivery: 'sms', devCode: this.config.get('NODE_ENV') === 'production' ? undefined : code };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const challenge = await this.prisma.otpChallenge.findFirst({
      where: { mobile: dto.mobile, code: dto.code, consumedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });
    if (!challenge) throw new UnauthorizedException('Invalid or expired OTP');
    await this.prisma.otpChallenge.update({ where: { id: challenge.id }, data: { consumedAt: new Date() } });
    const user = await this.prisma.user.upsert({
      where: { mobile: dto.mobile },
      update: { role: challenge.role },
      create: { mobile: dto.mobile, role: challenge.role },
      include: { driver: true },
    });
    return this.issueTokens(user.id, user.role);
  }

  async registerCustomer(dto: RegisterCustomerDto) {
    const user = await this.prisma.user.upsert({
      where: { mobile: dto.mobile },
      update: { name: dto.name, role: UserRole.CUSTOMER, preferredLanguage: dto.preferredLanguage },
      create: { mobile: dto.mobile, name: dto.name, role: UserRole.CUSTOMER, preferredLanguage: dto.preferredLanguage },
    });
    return { user };
  }

  async registerDriver(dto: RegisterDriverDto) {
    const user = await this.prisma.user.upsert({
      where: { mobile: dto.mobile },
      update: { name: dto.name, role: UserRole.DRIVER },
      create: { mobile: dto.mobile, name: dto.name, role: UserRole.DRIVER },
    });
    const driver = await this.prisma.driver.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });
    const profile = await this.prisma.driverProfile.upsert({
      where: { driverId: driver.id },
      update: { serviceArea: dto.serviceArea, languages: dto.languages, bio: dto.bio },
      create: { driverId: driver.id, serviceArea: dto.serviceArea, languages: dto.languages, bio: dto.bio },
    });
    return { user, driver, profile };
  }

  async refresh(refreshToken: string) {
    const stored = await this.prisma.refreshToken.findUnique({ where: { token: refreshToken }, include: { user: true } });
    if (!stored || stored.revokedAt || stored.expiresAt <= new Date()) throw new UnauthorizedException('Invalid refresh token');
    await this.prisma.refreshToken.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    return this.issueTokens(stored.userId, stored.user.role);
  }

  async logout(refreshToken: string) {
    if (!refreshToken) throw new BadRequestException('Refresh token is required');
    await this.prisma.refreshToken.updateMany({ where: { token: refreshToken, revokedAt: null }, data: { revokedAt: new Date() } });
    return { success: true };
  }

  private async issueTokens(userId: string, role: UserRole) {
    const payload = { sub: userId, role };
    const accessToken = this.tokens.sign(payload, this.config.getOrThrow<string>('JWT_ACCESS_SECRET'), 900);
    const refreshToken = randomUUID();
    await this.prisma.refreshToken.create({ data: { token: refreshToken, userId, expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60_000) } });
    return { accessToken, refreshToken, tokenType: 'Bearer', expiresIn: 900 };
  }
}
