import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ShareLocationDto } from './dto/share-location.dto';

@Injectable()
export class LocationsService {
  constructor(private readonly prisma: PrismaService) {}

  async shareMyLocation(userId: string, dto: ShareLocationDto) {
    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Driver profile not found. Complete driver registration first.');
    const [location] = await this.prisma.$transaction([
      this.prisma.driverLocation.create({ data: { driverId: driver.id, latitude: dto.latitude, longitude: dto.longitude } }),
      this.prisma.driver.update({ where: { id: driver.id }, data: { isAvailable: dto.isAvailable ?? true } }),
    ]);
    return location;
  }

  async stopSharing(userId: string) {
    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Driver profile not found. Complete driver registration first.');
    await this.prisma.driver.update({ where: { id: driver.id }, data: { isAvailable: false } });
    return { success: true };
  }
}
