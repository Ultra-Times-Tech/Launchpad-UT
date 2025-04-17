import {Controller, Get} from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('ultra-token')
  async getUltraToken() {
    return this.authService.getUltraToken()
  }
}