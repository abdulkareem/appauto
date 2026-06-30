import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateDriverProfileDto } from './dto/update-driver-profile.dto';

@Injectable()
export class DriversService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyDashboard(userId: string) {
    const driver = await this.findDriverForUser(userId);
    const [reviewCount, averageRating, vehicleCount, documentCount] = await Promise.all([
      this.prisma.review.count({ where: { driverId: driver.id } }),
      this.prisma.review.aggregate({ where: { driverId: driver.id }, _avg: { rating: true } }),
      this.prisma.vehicle.count({ where: { driverId: driver.id } }),
      this.prisma.driverDocument.count({ where: { driverId: driver.id } }),
    ]);
    return { driver, metrics: { reviewCount, averageRating: averageRating._avg.rating ?? 0, vehicleCount, documentCount } };
  }

  async getMyProfile(userId: string) {
    const driver = await this.findDriverForUser(userId);
    return this.prisma.driver.findUnique({
      where: { id: driver.id },
      include: { user: true, profile: true, vehicles: true, documents: true, reviews: true },
    });
  }

  async updateMyProfile(userId: string, dto: UpdateDriverProfileDto) {
    const driver = await this.findDriverForUser(userId);
    const { isAvailable, ...profileData } = dto;
    if (typeof isAvailable === 'boolean') {
      await this.prisma.driver.update({ where: { id: driver.id }, data: { isAvailable } });
    }
    const profile = await this.prisma.driverProfile.upsert({
      where: { driverId: driver.id },
      update: profileData,
      create: { driverId: driver.id, languages: profileData.languages ?? [], ...profileData },
    });
    return { profile, isAvailable: isAvailable ?? driver.isAvailable };
  }

  async createVehicle(userId: string, dto: CreateVehicleDto) {
    const driver = await this.findDriverForUser(userId);
    return this.prisma.vehicle.create({ data: { driverId: driver.id, registrationNumber: dto.registrationNumber.toUpperCase(), make: dto.make, model: dto.model } });
  }

  async listVehicles(userId: string) {
    const driver = await this.findDriverForUser(userId);
    return this.prisma.vehicle.findMany({ where: { driverId: driver.id }, orderBy: { createdAt: 'desc' } });
  }

  async deleteVehicle(userId: string, vehicleId: string) {
    const driver = await this.findDriverForUser(userId);
    const vehicle = await this.prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.driverId !== driver.id) throw new ForbiddenException('Vehicle belongs to another driver');
    await this.prisma.vehicle.delete({ where: { id: vehicleId } });
    return { success: true };
  }

  private async findDriverForUser(userId: string) {
    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Driver profile not found. Complete driver registration first.');
    return driver;
  }
}
