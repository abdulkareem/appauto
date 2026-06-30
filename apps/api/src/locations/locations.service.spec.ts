import { NotFoundException } from '@nestjs/common';
import { LocationsService } from './locations.service';

describe('LocationsService', () => {
  it('requires driver registration before sharing location', async () => {
    const prisma = { driver: { findUnique: jest.fn().mockResolvedValue(null) } };
    const service = new LocationsService(prisma as never);
    await expect(service.shareMyLocation('user-1', { latitude: 10, longitude: 76 })).rejects.toBeInstanceOf(NotFoundException);
  });
});
