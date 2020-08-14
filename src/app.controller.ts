import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
