import { IsArray, IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateDriverProfileDto {
  @IsOptional()
  @IsString()
  @Length(10, 500)
  bio?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsString()
  @Length(2, 120)
  serviceArea?: string;

  @IsOptional()
  workingHours?: Record<string, unknown>;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
