import { IsEnum } from 'class-validator';
import { DocumentType } from '@prisma/client';

export class UploadDriverDocumentDto {
  @IsEnum(DocumentType)
  type!: DocumentType;
}
