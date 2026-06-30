import { BadRequestException } from '@nestjs/common';
import { DocumentsService } from './documents.service';

describe('DocumentsService', () => {
  it('rejects unsafe document mime types', async () => {
    const service = new DocumentsService({} as never, {} as never);
    await expect(service.uploadMyDocument('user-1', 'LICENCE' as never, { mimetype: 'text/html', size: 10 } as never)).rejects.toBeInstanceOf(BadRequestException);
  });
});
