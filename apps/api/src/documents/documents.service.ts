import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DocumentType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

@Injectable()
export class DocumentsService {
  constructor(private readonly prisma: PrismaService, private readonly storage: StorageService) {}

  async listMyDocuments(userId: string) {
    const driver = await this.findDriverForUser(userId);
    return this.prisma.driverDocument.findMany({ where: { driverId: driver.id }, orderBy: { createdAt: 'desc' } });
  }

  async uploadMyDocument(userId: string, type: DocumentType, file?: Express.Multer.File) {
    if (!file) throw new BadRequestException('Document file is required');
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) throw new BadRequestException('Only JPEG, PNG, WebP, or PDF files are allowed');
    if (file.size > MAX_FILE_SIZE_BYTES) throw new BadRequestException('Document must be 5 MB or smaller');
    const driver = await this.findDriverForUser(userId);
    const stored = await this.storage.storeDriverDocument(file, driver.id);
    return this.prisma.driverDocument.create({
      data: { driverId: driver.id, type, url: stored.url, metadata: { key: stored.key, size: stored.size, mimeType: stored.mimeType } },
    });
  }

  private async findDriverForUser(userId: string) {
    const driver = await this.prisma.driver.findUnique({ where: { userId } });
    if (!driver) throw new NotFoundException('Driver profile not found. Complete driver registration first.');
    return driver;
  }
}
