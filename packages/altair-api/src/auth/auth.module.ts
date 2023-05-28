import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SecurityConfig } from 'src/common/config';
import { AuthService } from './auth.service';
import { PasswordService } from './password/password.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from './strategies/google.strategy';
import { EventsJwtStrategy } from './strategies/events-jwt.strategy';
import { StripeService } from 'src/stripe/stripe.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { TeamsService } from 'src/teams/teams.service';
import { QueriesService } from 'src/queries/queries.service';
import { QueryCollectionsService } from 'src/query-collections/query-collections.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        const securityConfig = configService.get<SecurityConfig>('security');
        return {
          secret: configService.get<string>('JWT_ACCESS_SECRET'),
          signOptions: {
            expiresIn: securityConfig?.expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    EventsJwtStrategy,
    GoogleStrategy,
    PasswordService,
    StripeService,
    UserService,
    TeamsService,
    QueriesService,
    QueryCollectionsService,
  ],
  controllers: [AuthController, UserController],
  exports: [UserService],
})
export class AuthModule {}
