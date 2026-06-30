import { IsArray, IsMobilePhone, IsOptional, IsString, Length } from 'class-validator';

export class RegisterDriverDto {
  @IsMobilePhone('en-IN')
  mobile!: string;

  @IsString()
  @Length(2, 80)
  name!: string;

  @IsString()
  @Length(4, 120)
  serviceArea!: string;

  @IsArray()
  @IsString({ each: true })
  languages!: string[];

  @IsOptional()
  @IsString()
  bio?: string;
}
