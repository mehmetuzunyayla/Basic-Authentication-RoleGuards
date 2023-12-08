import { Module } from '@nestjs/common';
import { Authmodule } from './authentication/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, Authmodule],
  controllers: [],
  providers: [],
})
export class AppModule {}
