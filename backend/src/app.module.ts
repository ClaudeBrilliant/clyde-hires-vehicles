import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { VehicleController } from './vehicle/vehicle.controller';
import { VehicleModule } from './vehicle/vehicle.module';
import { BookingController } from './booking/booking.controller';
import { BookingModule } from './booking/booking.module';
import { MailerModule } from './mailer/mailer.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ContactModule } from './contact/contact.module';
import { NotificationModule } from './notifications/notifications.module';
import { ReviewModule } from './reviews/reviews.module';
import { AuditLogModule } from './audit-logs/audit-logs.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    VehicleModule,
    BookingModule,
    MailerModule,
    CloudinaryModule,
    AuthModule,
    PrismaModule,
    ContactModule,
    NotificationModule,
    ReviewModule,
    AuditLogModule,
  ],
  controllers: [AppController, VehicleController, BookingController],
  providers: [AppService],
})
export class AppModule {}
