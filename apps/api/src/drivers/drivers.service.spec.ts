import { ForbiddenException } from '@nestjs/common';
import { DriversService } from './drivers.service';

describe('DriversService', () => {
  it('prevents deleting another driver vehicle', async () => {
    const prisma = {
      driver: { findUnique: jest.fn().mockResolvedValue({ id: 'driver-1', userId: 'user-1' }) },
      vehicle: { findUnique: jest.fn().mockResolvedValue({ id: 'vehicle-1', driverId: 'driver-2' }), delete: jest.fn() },
    };
    const service = new DriversService(prisma as never);
    await expect(service.deleteVehicle('user-1', 'vehicle-1')).rejects.toBeInstanceOf(ForbiddenException);
  });
});
