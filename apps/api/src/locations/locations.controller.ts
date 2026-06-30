import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ShareLocationDto } from './dto/share-location.dto';
import { LocationsService } from './locations.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DRIVER)
@Controller('drivers/me/location')
export class LocationsController {
  constructor(private readonly locations: LocationsService) {}

  @Post()
  share(@CurrentUser() user: AuthenticatedUser, @Body() dto: ShareLocationDto) {
    return this.locations.shareMyLocation(user.sub, dto);
  }

  @Delete()
  stop(@CurrentUser() user: AuthenticatedUser) {
    return this.locations.stopSharing(user.sub);
  }
}
