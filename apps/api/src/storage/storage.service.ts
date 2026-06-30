import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';

export type StoredObject = { url: string; key: string; size: number; mimeType: string };

@Injectable()
export class StorageService {
  constructor(private readonly config: ConfigService) {}

  async storeDriverDocument(file: Express.Multer.File, driverId: string): Promise<StoredObject> {
    const uploadRoot = this.config.get('LOCAL_UPLOAD_DIR', 'uploads');
    const safeExtension = extname(file.originalname).toLowerCase();
    const key = `drivers/${driverId}/${randomUUID()}${safeExtension}`;
    const absolutePath = join(process.cwd(), uploadRoot, key);
    await mkdir(join(process.cwd(), uploadRoot, `drivers/${driverId}`), { recursive: true });
    await writeFile(absolutePath, file.buffer);
    return { url: `/${uploadRoot}/${key}`, key, size: file.size, mimeType: file.mimetype };
  }
}
