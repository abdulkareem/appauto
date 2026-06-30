import { AuthService } from './auth.service';

describe('AuthService', () => {
  it('uses a six digit development OTP contract', async () => {
    const prisma = { otpChallenge: { create: jest.fn() } };
    const service = new AuthService(prisma as never, {} as never, { get: () => 'development' } as never);
    const result = await service.requestOtp({ mobile: '+919876543210', role: 'CUSTOMER' as never });
    expect(result.devCode).toBe('123456');
    expect(prisma.otpChallenge.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ code: '123456' }) }));
  });
});
