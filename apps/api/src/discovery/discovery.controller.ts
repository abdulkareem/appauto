import { Controller, Get, Query } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { NearbyDriversDto } from './dto/nearby-drivers.dto';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discovery: DiscoveryService) {}

  @Get('drivers/nearby')
  nearby(@Query() query: NearbyDriversDto) {
    return this.discovery.findNearbyDrivers(query);
  }
}
