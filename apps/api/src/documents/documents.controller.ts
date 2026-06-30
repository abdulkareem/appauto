import { Body, Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRole } from '@prisma/client';
import { CurrentUser, AuthenticatedUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { DocumentsService } from './documents.service';
import { UploadDriverDocumentDto } from './dto/upload-driver-document.dto';
import { UploadedFile as DriverUploadedFile } from '../common/types/file-upload';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.DRIVER)
@Controller('drivers/me/documents')
export class DocumentsController {
  constructor(private readonly documents: DocumentsService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.documents.listMyDocuments(user.sub);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 } }))
  upload(@CurrentUser() user: AuthenticatedUser, @Body() dto: UploadDriverDocumentDto, @UploadedFile() file: DriverUploadedFile) {
    return this.documents.uploadMyDocument(user.sub, dto.type, file);
  }
}
