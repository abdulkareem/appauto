import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateDriverProfileDto } from './dto/update-driver-profile.dto';
import { DriversService } from './drivers.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DRIVER)
@Controller('drivers/me')
export class DriversController {
  constructor(private readonly drivers: DriversService) {}

  @Get('dashboard')
  dashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.drivers.getMyDashboard(user.sub);
  }

  @Get('profile')
  profile(@CurrentUser() user: AuthenticatedUser) {
    return this.drivers.getMyProfile(user.sub);
  }

  @Put('profile')
  updateProfile(@CurrentUser() user: AuthenticatedUser, @Body() dto: UpdateDriverProfileDto) {
    return this.drivers.updateMyProfile(user.sub, dto);
  }

  @Get('vehicles')
  vehicles(@CurrentUser() user: AuthenticatedUser) {
    return this.drivers.listVehicles(user.sub);
  }

  @Post('vehicles')
  createVehicle(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateVehicleDto) {
    return this.drivers.createVehicle(user.sub, dto);
  }

  @Delete('vehicles/:vehicleId')
  deleteVehicle(@CurrentUser() user: AuthenticatedUser, @Param('vehicleId') vehicleId: string) {
    return this.drivers.deleteVehicle(user.sub, vehicleId);
  }
}
