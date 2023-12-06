import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({ example: 'your_access_token', description: '엑세스 토큰' })
  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @ApiProperty({ example: 'kakao', description: 'OAuth 공급자' })
  @IsNotEmpty()
  @IsString()
  vendor!: string; // 'kakao', 'google', 'apple' 중 하나
}
