import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterCustomerDto } from './dto/register-customer.dto';
import { RegisterDriverDto } from './dto/register-driver.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('otp/request')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.auth.requestOtp(dto);
  }

  @Post('otp/verify')
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.auth.verifyOtp(dto);
  }

  @Post('register/customer')
  registerCustomer(@Body() dto: RegisterCustomerDto) {
    return this.auth.registerCustomer(dto);
  }

  @Post('register/driver')
  registerDriver(@Body() dto: RegisterDriverDto) {
    return this.auth.registerDriver(dto);
  }

  @Post('refresh')
  refresh(@Body('refreshToken') refreshToken: string) {
    return this.auth.refresh(refreshToken);
  }

  @Post('logout')
  logout(@Body('refreshToken') refreshToken: string) {
    return this.auth.logout(refreshToken);
  }
}
