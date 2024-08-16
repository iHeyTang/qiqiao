import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

class LoginDTO {
  @ApiProperty()
  username: string;

  @ApiProperty()
  password: string;
}

class LoginResultDTO {
  @ApiProperty()
  access_token: string;
}

@Controller({ path: 'auth' })
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginResultDTO })
  @Post('/login')
  async login(@Body() body: LoginDTO): Promise<LoginResultDTO> {
    return this.authService.login({
      username: body.username,
      password: body.password,
    });
  }

  @HttpCode(HttpStatus.OK)
  @Post('/init-admin')
  async initAdmin(@Body() body: LoginDTO) {
    return this.authService.initAdmin(body.username, body.password);
  }
}
