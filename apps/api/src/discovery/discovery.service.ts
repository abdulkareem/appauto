import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NearbyDriversDto } from './dto/nearby-drivers.dto';

type Coordinates = { latitude: number; longitude: number };
const EARTH_RADIUS_KM = 6371;

@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  async findNearbyDrivers(query: NearbyDriversDto) {
    const latitudeDelta = query.radiusKm / 111;
    const longitudeDelta = query.radiusKm / (111 * Math.cos((query.latitude * Math.PI) / 180));
    const locations = await this.prisma.driverLocation.findMany({
      where: {
        latitude: { gte: query.latitude - latitudeDelta, lte: query.latitude + latitudeDelta },
        longitude: { gte: query.longitude - longitudeDelta, lte: query.longitude + longitudeDelta },
        driver: { isAvailable: true, verificationStatus: 'APPROVED' },
      },
      distinct: ['driverId'],
      orderBy: { sharedAt: 'desc' },
      include: { driver: { include: { user: true, profile: true, vehicles: true, reviews: true, documents: true } } },
      take: query.limit * 3,
    });

    return locations
      .map((location) => {
        const coordinates = { latitude: Number(location.latitude), longitude: Number(location.longitude) };
        const distanceKm = this.distanceKm(query, coordinates);
        const rating = this.averageRating(location.driver.reviews.map((review) => review.rating));
        return { driver: location.driver, location: coordinates, sharedAt: location.sharedAt, distanceKm, rating };
      })
      .filter((item) => item.distanceKm <= query.radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, query.limit);
  }

  private distanceKm(origin: Coordinates, destination: Coordinates) {
    const dLat = this.toRadians(destination.latitude - origin.latitude);
    const dLon = this.toRadians(destination.longitude - origin.longitude);
    const lat1 = this.toRadians(origin.latitude);
    const lat2 = this.toRadians(destination.latitude);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
  }

  private toRadians(value: number) {
    return (value * Math.PI) / 180;
  }

  private averageRating(ratings: number[]) {
    if (!ratings.length) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  }
}
