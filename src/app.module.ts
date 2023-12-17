import { Module } from '@nestjs/common';
import { Authmodule } from './authentication/auth.module';
import { UsersModule } from './users/users.module';
import { SeedingController } from './users/seedling.controller';

@Module({
  imports: [UsersModule, Authmodule],
  controllers: [SeedingController],
  providers: [],
})
export class AppModule {}
