// seeding.controller.ts
import { Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authentication/auth.guard';
import { Roles } from "src/authentication/roles.decorator"; // Import the Roles decorator
import { RegisterUsersDto } from 'src/authentication/dto/register-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/authentication/auth.service';
import { RolesGuard } from 'src/authentication/roles.guard';

@Controller('seeding')
export class SeedingController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService, // Include AuthService in the constructor
  ) {}

  @Post('create-admin')
  @Roles('admin')
  @UseGuards(JwtAuthGuard,RolesGuard)
  async createAdmin(): Promise<any> {
    // Check if an admin user already exists
    const adminExists = await this.usersService.checkAdminExists();

    if (!adminExists) {
      // Create an admin user
      const adminDto: RegisterUsersDto = {
        username: 'mehmet1',
        password: 'mehmet123',
        name: 'mehmet',
        email: 'mehmet@gmail.com',
        age: 30,
        role: 'admin',
      };

      await this.authService.register(adminDto);

      return { message: 'Admin user created successfully.' };
    } else {
      return { message: 'Admin user already exists.' };
    }
  }
}
