import { IsInt, IsLatitude, IsLongitude, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class NearbyDriversDto {
  @Type(() => Number)
  @IsLatitude()
  latitude!: number;

  @Type(() => Number)
  @IsLongitude()
  longitude!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(25)
  radiusKm = 5;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 20;
}
