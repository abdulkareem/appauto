import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @Length(4, 20)
  @Matches(/^[A-Z0-9 -]+$/i)
  registrationNumber!: string;

  @IsOptional()
  @IsString()
  @Length(2, 60)
  make?: string;

  @IsOptional()
  @IsString()
  @Length(1, 60)
  model?: string;
}
