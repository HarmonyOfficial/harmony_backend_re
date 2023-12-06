import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequest {
  @ApiProperty({
    example: 'your_kakao_access_token',
    description: '카카오 엑세스 토큰',
  })
  @IsNotEmpty()
  @IsString()
  accessToken!: string;

  @ApiProperty({
    example: 'kakao',
    description: 'OAuth 제공사명',
  })
  @IsNotEmpty()
  @IsString()
  vendor!: string;
}
