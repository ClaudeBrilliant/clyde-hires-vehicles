import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
}

export class MarkAsReadDto {
  notificationId: string;
}
