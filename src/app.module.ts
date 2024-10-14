import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RedisModule } from './redis.module';
import { UsersModule } from './users/users.module'; // UsersModule import
import { CharactersModule } from './characters/characters.module'; // CharactersModule 가져오기
import { ItemsModule } from './items/items.module'; // ItemsModule 가져오기
import { UserItemsModule } from './user-items/user-items.module'; // UserItemsModule 가져오기

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    UsersModule,
    CharactersModule, // CharactersModule 등록
    ItemsModule, // ItemsModule 등록
    UserItemsModule, // UserItemsModule 등록
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule {}
