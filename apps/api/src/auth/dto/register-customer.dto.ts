import { IsMobilePhone, IsOptional, IsString, Length } from 'class-validator';

export class RegisterCustomerDto {
  @IsMobilePhone('en-IN')
  mobile!: string;

  @IsString()
  @Length(2, 80)
  name!: string;

  @IsOptional()
  @IsString()
  preferredLanguage?: string;
}
