import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty() @IsEmail() email: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsString() @MinLength(6) password: string;
  @ApiProperty({ enum: ['user', 'admin'], required: false })
  @IsOptional() @IsEnum(['user', 'admin'] as const) role?: 'user' | 'admin';
}
