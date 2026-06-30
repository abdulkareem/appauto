import { DiscoveryService } from './discovery.service';

describe('DiscoveryService', () => {
  it('sorts nearby drivers by calculated distance', async () => {
    const prisma = {
      driverLocation: {
        findMany: jest.fn().mockResolvedValue([
          { latitude: 10.1, longitude: 76.3, sharedAt: new Date(), driver: { reviews: [{ rating: 5 }] } },
          { latitude: 10.001, longitude: 76.001, sharedAt: new Date(), driver: { reviews: [{ rating: 4 }] } },
        ]),
      },
    };
    const service = new DiscoveryService(prisma as never);
    const results = await service.findNearbyDrivers({ latitude: 10, longitude: 76, radiusKm: 50, limit: 10 });
    expect(results[0].distanceKm).toBeLessThan(results[1].distanceKm);
    expect(results[0].rating).toBe(4);
  });
});
