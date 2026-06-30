import { IsEnum, IsMobilePhone } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RequestOtpDto {
  @IsMobilePhone('en-IN')
  mobile!: string;

  @IsEnum(UserRole)
  role!: UserRole.CUSTOMER | UserRole.DRIVER;
}
