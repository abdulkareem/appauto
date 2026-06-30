import { IsLatitude, IsLongitude, IsOptional, IsBoolean } from 'class-validator';

export class ShareLocationDto {
  @IsLatitude()
  latitude!: number;

  @IsLongitude()
  longitude!: number;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
