import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Cho phép tất cả các origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức HTTP được phép
    allowedHeaders: 'Content-Type, Authorization', // Các header được phép
    credentials: true, // Cho phép gửi cookie hoặc thông tin xác thực
  });
  app.use(json({ limit: '50mb' })); // Use lowercase json
  app.use(urlencoded({ limit: '50mb', extended: true }));
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT', 3000);
  // await app.listen(3000);
  await app.listen(port);
}

bootstrap();
